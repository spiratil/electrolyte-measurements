import solver from 'javascript-lp-solver';
import type { Data, AllSolutions, Solution, Nutrient, Product, Ingredient, Results, ProductMatrix } from '$lib/definitions/definitions';
import { unitConv } from '$lib/definitions/definitions';

function addNewSolution(data: any, value: string) {
  data.push( <Solution> {
    id: data.length,
    name: value,
    nutrients: [],
    products: []
  });

  addNewNutrient(data[data.length - 1].nutrients);
  addNewProduct(data[data.length - 1].products);
}

function addNewNutrient(data: any) {
  data.push( <Nutrient> {
    id: data.length,
    name: '',
    amount: -1,
    unit: ''
  });
}

function addNewProduct(data: any) {
  data.push( <Product> {
    id: data.length,
    name: '',
    form: '',
    totalAmount: -1,
    totalUnits: '',
    serveSize: -1,
    serveUnits: '',
    price: 0,
    ingredients: []
  });

  addNewIngredient(data[data.length - 1].ingredients);
}

function addNewIngredient(data: any) {
  data.push( <Ingredient> {
    id: data.length,
    name: '',
    amountPerServe: -1,
    unit: ''
  });
}

export const ts: Data = {
  // Remove entries from arrays within the data object
  addArrayEntry(data, path, value) {
    if (!Object.hasOwn(data, path[0]))
      throw new Error(`Property '${path[0]}' does not exist.`);

    if (Array.isArray(data[path[0]])) {
      if (path.length == 1) {
        switch (path[0]) {
          case 'solutions':
            addNewSolution(data[path[0]], value as string);
            break;
          case 'nutrients':
            addNewNutrient(data[path[0]]);
            break;
          case 'products':
            addNewProduct(data[path[0]]);
            break;
          case 'ingredients':
            addNewIngredient(data[path[0]]);
            break;
        }          
      }
      else
        this.addArrayEntry(data[path[0]], path.slice(1), value);
    }
    else
        this.addArrayEntry(data[path[0]], path.slice(1), value);

    // If a new solution was added, make this the currently selected solution in the UI
    if (path[path.length - 1] == 'solutions')
      data.selected = data.solutions.length - 1;
  },

  // Remove entries from arrays within the data object
  deleteArrayEntry(data: any, path: (string|number)[], id: number) {
    if (!Object.hasOwn(data, path[0]))
      throw new Error(`Property '${path[0]}' does not exist.`);

    if (Array.isArray(data[path[0]])) {
      if (path.length == 1) {
        // Add the entry deletion to a microtask to prevent Svelte attempting to render the state during the mutation
        queueMicrotask(() => {
          data[path[0]].splice(id, 1);

          // Update the IDs of each entry
          data[path[0]].forEach((entry: Solution|Nutrient|Product|Ingredient, i: number) => {
            entry.id = i;
          });
  
          // Update the selected solution after being deleted
          if (path[0] == 'solutions' && data.selected != 0) {
            data.selected -= 1;
          }
        });
      }
      else
        this.deleteArrayEntry(data[path[0]], path.slice(1), id);
    }
    else
        this.deleteArrayEntry(data[path[0]], path.slice(1), id);
  },

  // Turn the stringified data object back into the correct interface types
  fromJSON(obj) {
    const data : AllSolutions = {
      selected: Number(obj.selected),
      // Restore all solutions
      solutions: (() => {
        let resSolutions : Solution[] = [];
        
        obj.solutions.forEach((sol: any, solIdx: number) => {
          resSolutions.push({
            id: sol.id,
            name: sol.name,
            // Restore all nutrients for this solution
            nutrients: (() => {
              let resNutrients : Nutrient[] = [];
              obj.solutions[solIdx].nutrients.forEach((nut: any) => {
                resNutrients.push({
                  id : nut.id,
                  name : nut.name,
                  amount : nut.amount,
                  unit : nut.unit
                });
              });
              
              return resNutrients;
            })(),
            // Restore all products for this solution
            products: (() => {
              let resProducts : Product[] = [];
              obj.solutions[solIdx].products.forEach((prod: any, prodIdx: number) => {
                resProducts.push({
                  id : prod.id,
                  name : prod.name,
                  form : prod.form,
                  totalAmount : prod.totalAmount,
                  totalUnits: prod.totalUnits,
                  serveSize : prod.serveSize,
                  serveUnits: prod.serveUnits,
                  price: prod.price,

                  // Restore all ingredients for this product
                  ingredients : (() => {
                    let resIngredients : Ingredient[] = [];
                    obj.solutions[solIdx].products[prodIdx].ingredients.forEach((ing: any) => {
                      resIngredients.push({
                        id : ing.id,
                        name : ing.name,
                        amountPerServe : ing.amountPerServe,
                        unit : ing.unit
                      });
                    });
                    
                    return resIngredients;
                  })(),
                });
              });
              
              return resProducts;
            })()
          });
        });

        return resSolutions;
      })()
    };

    return data;
  },

  // Turn the data object into a string with all required data fields for storage in cache
  toJSON(data) {
    // Prepare the object
    const stringified: any = {
      selected: data.selected,
      solutions: []
    };

    // Prepare the Solution object
    data.solutions.forEach((sol: any, solIdx: number) => {
      stringified.solutions.push({
        id: sol.id,
        name: sol.name,
        nutrients: [],
        products: []
      });

      // Prepare the Nutrient array for each solution
      sol.nutrients.forEach((nut: any) => {
        stringified.solutions[solIdx].nutrients.push({
          id: nut.id,
          name: nut.name,
          amount: nut.amount,
          unit: nut.unit
        });
      });

      // Prepare the Product array for each solution
      sol.products.forEach((prod: any, prodIdx: number) => {
        stringified.solutions[solIdx].products.push({
          id: prod.id,
          name : prod.name,
          form: prod.form,
          totalAmount : prod.totalAmount,
          totalUnits: prod.totalUnits,
          serveSize : prod.serveSize,
          serveUnits: prod.serveUnits,
          unit : prod.unit,
          price: prod.price,
          ingredients: []
        });

        // Prepare the Ingredient array for each solution
        prod.ingredients.forEach((ing: any) => {
          stringified.solutions[solIdx].products[prodIdx].ingredients.push({
            id : ing.id,
            name : ing.name,
            amountPerServe : ing.amountPerServe,
            unit : ing.unit
          });
        });
      });
    });

    return JSON.stringify(stringified);
  },

  setExampleData(data) {
    data.solutions.push({
      id: 0,
      name: 'Example',
      nutrients: [
        {
          id: 0,
          name: 'Potassium',
          amount: 1.5,
          unit: 'g'
        },
        {
          id: 1,
          name: 'Magnesium',
          amount: 260,
          unit: 'mg'
        },
        {
          id: 2,
          name: 'Sodium',
          amount: 2,
          unit: 'g'
        }
      ],
      products: [
        {
          id: 0,
          name: 'Potassium Chloride',
          form: 'powder',
          totalAmount: 227,
          totalUnits: 'g',
          serveSize: 700,
          serveUnits: 'mg',
          price: 10,
          ingredients: [
            {
              id: 0,
              name: 'Potassium',
              amountPerServe: 363,
              unit : 'mg'
            },
            {
              id: 1,
              name: 'Magnesium',
              amountPerServe: 7,
              unit : 'mg'
            }
          ]
        },
        {
          id: 1,
          name: 'Magnesium Glycinate 750mg',
          form: 'capsule',
          totalAmount: 120,
          totalUnits: '',
          serveSize: 1,
          serveUnits: '',
          price: 40,
          ingredients: [
            {
              id: 0,
              name: 'Magnesium',
              amountPerServe: 150,
              unit : 'mg'
            }
          ]
        },
        {
          id: 2,
          name: 'Sodii',
          form: 'powder',
          totalAmount: 177,
          totalUnits: 'g',
          serveSize: 5.9,
          serveUnits: 'g',
          price: 64,
          ingredients: [
            {
              id: 0,
              name: 'Sodium',
              amountPerServe: 1000,
              unit : 'mg'
            },
            {
              id: 1,
              name: 'Potassium',
              amountPerServe: 210,
              unit : 'mg'
            },
            {
              id: 2,
              name: 'Magnesium',
              amountPerServe: 70,
              unit : 'mg'
            }
          ]
        }
      ]
    });

    return data;
  },

  // Recursively update the data by iterating through the data object until the required property is found
  updateData(data, path, value) {
    if (!Object.hasOwn(data, path[0]))
      throw new Error(`Property '${path[0]}' does not exist.`);

    // Check if the current key value is an array or object and continue to the next level if so
    if (Array.isArray(data[path[0]]) || typeof data[path[0]] == 'object')
      this.updateData(data[path[0]], path.slice(1), value);
    // Write the data if the key value is not an array or object
    else
      data[path[0]] = value;
  },

  // Calculate the solution results if possible
  updateSolutionResults(data) {
    // Return if no solutions exist
    if (data.solutions.length == 0)
      return null;

    // Create the target nutrient matrix for lexicographic optimisation
    let nutrientNames: string[] = [];
    let targetNutrients: number[] = [];
    for (const nutrient of data.solutions[data.selected].nutrients) {
      // Check that the nutrient has been fully filled in
      if (nutrient.name == '' || nutrient.amount <= 0 || nutrient.unit == '')
        continue;

      nutrientNames.push(nutrient.name);
      targetNutrients.push(nutrient.amount * unitConv[nutrient.unit] * 1000000);
    }

    if (nutrientNames.length == 0) {
      return null;
    }

    // Create the products matrices
    let products: ProductMatrix[] = [];
    let prodSingleSer: number[] = [];
    let prodTotSer: number[] = [];
    let prodForms: string[] = [];
    for (const product of data.solutions[data.selected].products) {
      if (product.name == '' || product.form == '' || product.totalAmount <= 0 || product.serveSize <= 0)
        continue;
      if (product.form != 'capsule' && product.form != 'tablet' && (product.serveUnits == '' || product.totalUnits == ''))
        continue;
      if (product.ingredients.length == 1 && (product.ingredients[0].name == '' || product.ingredients[0].amountPerServe <= 0 || product.ingredients[0].unit == ''))
        continue;

      prodTotSer.push(product.totalAmount);
      prodSingleSer.push(product.form == 'capsule' || product.form == 'tablet' ? 1 : product.serveSize * unitConv[product.serveUnits]);
      prodForms.push(product.form);
      products.push({
        name: product.name,
        nutrient: (() => {
          let ingredientAmounts : number[] = Array(nutrientNames.length).fill(0);
          for (const ingredient of product.ingredients) {
            const nutIdx = nutrientNames.indexOf(ingredient.name);
            if (nutIdx < 0)
              continue;
            ingredientAmounts[nutIdx] = ingredient.amountPerServe * unitConv[ingredient.unit] * 1000000;
          }
          return ingredientAmounts;
        })(),
        price: product.price * (product.serveSize * unitConv[product.serveUnits != '' ? product.serveUnits : 'g']) / (product.totalAmount * unitConv[product.totalUnits != '' ? product.totalUnits : 'g'])
      });
    }

    if (products.length == 0)
      return null;

    const res = optimizeProducts(products, targetNutrients);
    const results: Results[] = [];

    // Create the array of results to return to the user
    for (const [i, result] of res.entries()) {
      // Create a new entry for each optimization
      results.push({
        bounded: result ? <boolean> result.bounded : false,
        feasible: result ? <boolean> result.feasible : false,
        price: 0,
        products: [],
        nutrients: []
      });

      // Prepare the nutrients list of the final solution
      for (const nutrient of data.solutions[data.selected].nutrients) {
        if (nutrient.name == '')
          continue;
        results[i].nutrients.push({
          name: nutrient.name,
          requirement: true,
          amount: 0,
          unit: nutrient.unit,
          targetDifference: 0,
          targetUnit: ''
        });
      }

      try {
        // Check if the optimization was successful
        if (!result || !result.feasible)
          throw new Error(`UNFEASIBLE ${i}`)
        if (!result.bounded)
          throw new Error(`UNREALISTIC ${i}`)

        // Iterate through each product amounts returned from the optimization
        for (const [key, val] of Object.entries(<object> res[i])) {
          if (!key.includes('product'))
            continue;

          // Determine the product specifics for the amount calculated
          const prodIdx = Number(key.replace('product', ''));
          const product = data.solutions[data.selected].products[prodIdx];
          const prodAmt = product.form == 'capsule' || product.form == 'tablet'
                          ? val * product.serveSize
                          : val * product.serveSize * unitConv[product.serveUnits];
          const prodUnit = determineFinalProductUnits(prodAmt, product.form);
          const prodFinAmt = product.form == 'capsule' || product.form == 'tablet'
                             ? prodAmt
                             : prodAmt / unitConv[prodUnit];
          const prodTotAmt = product.form == 'capsule' || product.form == 'tablet'
                             ? product.totalAmount / prodAmt
                             : (product.totalAmount * unitConv[product.totalUnits]) / prodAmt;
          results[i].price += product.form == 'capsule' || product.form == 'tablet'
                             ? val * product.price * product.serveSize / product.totalAmount
                             : val * product.price * (product.serveSize * unitConv[product.serveUnits]) / (product.totalAmount * unitConv[product.totalUnits])

          // Add the product calculations to the results to return to the user
          results[i].products.push({
            name: product.name,
            amount: Math.round((prodFinAmt + Number.EPSILON) * 100) / 100,
            serve: Math.round((val + Number.EPSILON) * 100) / 100,
            unit: prodUnit,
            totalServe: Math.round((prodTotAmt + Number.EPSILON) * 100) / 100
          });

          // Add each the proportion of each ingredient in the used products to the total nutrients
          for (const ingredient of product.ingredients) {
            const nutIdx = Number(nutrientNames.indexOf(ingredient.name));

            // Add the to the sum of total nutrients if it already exists in the return results
            for (const nutrient of results[i].nutrients) {
              if (ingredient.name == nutrient.name)
                nutrient.amount += val * ingredient.amountPerServe * unitConv[ingredient.unit];
            }

            // Add the nutrient to the return results if it doesn't exist
            if (nutIdx < 0) {
              results[i].nutrients.push({
                name: ingredient.name,
                requirement: false,
                amount: val * ingredient.amountPerServe * unitConv[ingredient.unit],
                unit: ingredient.unit == 'mL' || ingredient.unit == 'L' ? 'L' : 'g',
                targetDifference: null,
                targetUnit: ''
              });
            }
          }
        }

        // Iterate through the completed list of nutrients and complete final calculations
        for (const nutrient of results[i].nutrients) {
          if (nutrient.unit == 'L' || nutrient.unit == 'mL')
            nutrient.unit = determineFinalProductUnits(nutrient.amount, 'liquid');
          else 
            nutrient.unit = determineFinalProductUnits(nutrient.amount, 'powder');

          const nutIdx = Number(nutrientNames.indexOf(nutrient.name));

          const difference = nutrient.amount - (targetNutrients[nutIdx] / 1000000);

          
          if (nutrient.unit == 'L' || nutrient.unit == 'mL')
            nutrient.targetUnit = determineFinalProductUnits(difference, 'liquid');
          else 
            nutrient.targetUnit = determineFinalProductUnits(difference, 'powder');

          nutrient.amount = Math.round((nutrient.amount / unitConv[nutrient.unit] + Number.EPSILON) * 100) / 100;
          nutrient.targetDifference = Math.round((difference / unitConv[nutrient.targetUnit] + Number.EPSILON) * 100) / 100;
        }
      }
      catch (err) {
        if (err instanceof Error) {
          if (err.message == 'UNFEASIBLE')
            results[results.length - 1].feasible = false;
          if (err.message == 'UNREALISTIC')
            results[results.length - 1].bounded = false;
        }
      }
    }

    return results;
  },
}

function determineFinalProductUnits(value: number, form: string): string {
  switch (form) {
    case 'powder':
      if (Math.abs(value) < 1) {
        if (Math.abs(value) < 0.001)
          return 'μg / mcg';
        return 'mg';
      }
      return 'g';
    case 'liquid':
      if (Math.abs(value) < 1) {
        return 'mL';
      }
      return 'L';
    case 'capsule':
    case 'tablet':
        return Math.abs(value) == 1 ? form.substring(0, 3) : `${form.substring(0, 3)}s`;
    default:
      throw new Error('Unknown form provided to determineFinalDecimalsAndUnits.')
  }
}

function optimizeProducts(products: any[], targetNutrients: number[]): (solver.Solution<string>|null)[] {
  // Minimize nutrient deviation
  const model1 = buildProductModel(products, targetNutrients, false);
  const result1 = solver.Solve(model1);

  if (!result1.feasible || !result1.bounded)
    return [result1, null];

  // Minimize cost with deviation constraints
  const model2 = buildProductModel(products, targetNutrients, true, 0.01);
  const result2 = solver.Solve(model2);

  return [result1, result2];
}

function buildProductModel(products: any[], targetNutrients: number[], minimizeCost = false, deviation = 0.01): any {
  const model: any = {
    optimize: minimizeCost ? 'cost' : 'deviationSum',
    opType: 'min',
    constraints: {},
    variables: {},
  };

  products.forEach((product, idx) => {
    const varName = `product${idx}`;
    model.variables[varName] = {
      cost: product.price,
      deviationSum: 0,
    };
    targetNutrients.forEach((_, nutIdx) => {
      const nutrientName = `nutrient${nutIdx}`;
      model.variables[varName][nutrientName] = product.nutrient[nutIdx];
    });
  });

  targetNutrients.forEach((target, nutIdx) => {
    const nutrientName = `nutrient${nutIdx}`;
    if (minimizeCost) {
      // Use deviation range instead of strict equality
      model.constraints[nutrientName] = {
        min: target * (1 - deviation),
        max: target * (1 + deviation),
      };
    } else {
      // First step — use equality and introduce deviation terms
      model.constraints[nutrientName] = { equal: target };

      // Add positive and negative deviation terms
      const plusDev = `plusDev${nutIdx}`;
      const minusDev = `minusDev${nutIdx}`;

      model.variables[plusDev] = {
        [nutrientName]: 1,
        cost: 0,
        deviationSum: 1,
      };
      model.variables[minusDev] = {
        [nutrientName]: -1,
        cost: 0,
        deviationSum: 1,
      };
    }
  });

  return model;
}