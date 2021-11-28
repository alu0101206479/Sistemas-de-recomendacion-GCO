// Leo el fichero
var fichero = document.getElementById('fichero')
var matriz_entrada = []

// Almaceno en matriz_entrada la matriz contenida en el fichero
fichero.addEventListener('change', function(e) {
  matriz_entrada = []
  let reader = new FileReader();
  reader.onload = function () {
    let lines = reader.result.toString()
    let filas = lines.split("\n")

    filas.forEach((fila) => {
      matriz_entrada.push(fila.split(" "));
    })
  }
  reader.readAsText(fichero.files[0]);
}, false)

  // Función que calcula las medias de las calificaciones de los items de todos los usuarios de la matriz y las retorna en forma de vector
  function calculo_medias(matriz, i) {
    let medias = []
    

    for (let i = 0; i < matriz.length; i++) {
      let contador = 0;
      let sumatorio = 0;

      for (let j = 0; j < matriz[i].length; j++) {
        if (matriz[i][j] !== "-") {
          sumatorio = sumatorio + parseInt(matriz[i][j]);
          contador++;
        }
      }

      medias.push(sumatorio/contador);

      
    }
    
    return medias;
  }

  // Función que calcula la predicción de la calificación de un usuario a un item con tipo de predicción "Simple"
  function simple(matriz, item, num_vecinos, similitudes) {
    // Se necesitan un número mínimo de k vecinos para la predicción simple (No menos de 3)
    if (num_vecinos < 3) {
      alert("ERROR: EL número elegido de vecinos es demasiado pequeño para obtener predicciones con 'Predicción simple', no pueden seleccinarse menos de 3 vecinos");
      throw new Error();
    } else {

        let numerador = 0;
        let denominador = 0;    

        // Calculo de formula
        for (let k = 0; k < num_vecinos; k++) {
            numerador = numerador + (similitudes[k][1]*parseInt(matriz[similitudes[k][0]][item]))
            denominador = denominador + Math.abs(similitudes[k][1],matriz[similitudes[3][0]][item])
        }
        let resultado = numerador/denominador;

        return resultado;
    }
  }


  // Función que calcula la predicción de la calificación de un usuario a un item con tipo de predicción "Diferencia con la media"
  function dif_media(matriz, medias, u, item, num_vecinos,  similitudes) {
    let numerador = 0;
    let denominador = 0;

    // Calculo de formula
    for (let k = 0; k < num_vecinos; k++) {
      numerador = numerador + (similitudes[k][1] * (parseInt(matriz[similitudes[k][0]][item]) - medias[similitudes[k][0]]))
      denominador = denominador + Math.abs(similitudes[k][1])
    }

    let resultado = medias[u] + numerador/denominador

    return resultado;
  }


  // Función que calcula las similitud entre dos usuarios a través del "Coeficiente de Pearson"
  function coeficiente_pearson(matriz, medias, usuario1, usuario2) {
    let vec_aux = []

    // Obtengo las posiciones de los items calificados por ambos usuarios para posteriormente hacer el sumatorio con los items calificados por los dos
    for (let i = 0; i < matriz[usuario1].length; i++) {
      if (matriz[usuario1][i] !== "-" && matriz[usuario2][i] !== "-") {
        vec_aux.push(i)
      }
    }

    let numerador = 0
    let den_1 = 0
    let den_2 = 0

    // Calculo de formulas
    for (let i = 0; i < vec_aux.length; i++) {
      numerador = numerador + ((parseInt(matriz[usuario1][vec_aux[i]])-medias[usuario1])*(parseInt(matriz[usuario2][vec_aux[i]])-medias[usuario2]))

      den_1 = den_1 + Math.pow(parseInt(matriz[usuario1][vec_aux[i]])-medias[usuario1],2)
      den_2 = den_2 + Math.pow(parseInt(matriz[usuario2][vec_aux[i]])-medias[usuario2],2)
    }

    den_1 = Math.sqrt(den_1)
    den_2 = Math.sqrt(den_2)
    let denominador = den_1*den_2

    let resultado = parseFloat((numerador/denominador).toFixed(2))

    return resultado

  }


  // Función que calcula la similitud entre dos usuarios a través de la "Distancia Coseno"
  function coseno(matriz, usuario1, usuario2) {
    let vec_aux = []

    // Obtengo las posiciones de los items calificados por ambos usuarios para posteriormente hacer el sumatorio con los items calificados por los dos
    for (let i = 0; i < matriz[usuario1].length; i++) {
      if (matriz[usuario1][i] != "-" && matriz[usuario2][i] != "-") {
        vec_aux.push(i)
      }
    }

    let numerador = 0
    let den_1 = 0
    let den_2 = 0

    // Calculo de formulas
    for (let i = 0; i < vec_aux.length; i++) {
      numerador = numerador+(parseInt(matriz[usuario1][vec_aux[i]])*parseInt(matriz[usuario2][vec_aux[i]]))

      den_1 = den_1+Math.pow(parseInt(matriz[usuario1][vec_aux[i]]), 2)
      den_2 = den_2+Math.pow(parseInt(matriz[usuario2][vec_aux[i]]), 2)
    }

    den_1 = Math.sqrt(den_1)
    den_2 = Math.sqrt(den_2)
    let denominador = den_1*den_2

    let resultado = parseFloat((numerador/denominador).toFixed(2))

    return resultado
  }


  // Función que calcula la similitud entre dos usuarios a través de la "Distancia Euclídea"
  function euclidea(matriz, usuario1, usuario2) {
    let vec_aux = []

    // Obtengo las posiciones de los items calificados por ambos usuarios para posteriormente hacer el sumatorio con los items calificados por los dos
    for (let i = 0; i < matriz[usuario1].length; i++) {
      if (matriz[usuario1][i] !== "-" && matriz[usuario2][i] !== "-") {
        vec_aux.push(i)
      }
    }
    
    let resultado = 0

    // Calculo de formula
    for (let i = 0; i < vec_aux.length; i++) {
      resultado = resultado+Math.pow((parseInt(matriz[usuario1][vec_aux[i]])-parseInt(matriz[usuario2][vec_aux[i]])), 2)
    }

    resultado = parseFloat(Math.sqrt(resultado).toFixed(2))

    return resultado
  }
  

  // Función principal del programa, esta función es la que llama a todas las demás y la que se encarga de completar la matriz de predicciones, calcular todas las similitudes, todas las predicciones...
  function completar_matriz(matriz, metrica, num_vecinos, tipo_pred) {
    let matriz_salida = JSON.parse(JSON.stringify(matriz)); // Matriz que se va a completar, copia de la matriz original
    let similiaridades = [];  // Similiaridades entre todos los pares de usuarios en un Vector de vectores con formato [[Pos. usuario u, [Pos. usuario v, Similitud entre ellos]..]...]
    let vecinos_seleccionados = []; // Vector que contendrá los vecinos seleccionados en cada predicción en vectores con formato [Pos. usuario, Pos. item, [Pos. vecino X, Pos. Vecino Y..]..]
    let calculo_predicciones = [];  // Vector que contendrá los resultados de cada predicción en un vector de vectores con formato [[Pos. usuario, Pos. Item, Calc. Predicción]..]
    let medias_usuarios = calculo_medias(matriz); // Vector con todas las medias de los usuarios

    // Calculo de las similiaridades entre todos los usuarios según la metrica elegida
    for (let i = 0; i < matriz.length; i++) {
      for (let j = 0; j < matriz.length; j++) {
        if (i !== j) {
          let indice = 0;
          switch (metrica) {
            case "Correlación de Pearson":
              
              indice = similiaridades.findIndex((elemento) => {
                if (elemento[0] === i) {
                  return true;
                }
              })

              // Se evalúa si ya en el vector se encuentra el usuario (Ya se ha introducido la similitud con algun otro usuario)
              if (indice === -1) {
                similiaridades.push([i, [[j, coeficiente_pearson(matriz, medias_usuarios, i, j)]]]); // Se introduce por primera vez el usuario y su similitud con otro usuario
              } else {
                similiaridades[indice][1].push([j, coeficiente_pearson(matriz, medias_usuarios, i, j)]) // Se introduce la similitud con otro usuario más
              }
              
              break
            case "Distancia coseno":
              indice = similiaridades.findIndex((elemento, indice) => {
                if (elemento[0] === i) {
                  return true;
                }
              })

              if (indice === -1) {
                similiaridades.push([i, [[j, coseno(matriz, i, j)]]]);
              } else {
                similiaridades[indice][1].push([j, coseno(matriz, i, j)])
              }
              break
            case "Distancia Euclídea":
              indice = similiaridades.findIndex((elemento, indice) => {
                if (elemento[0] === i) {
                  return true;
                }
              })

              if (indice === -1) {
                similiaridades.push([i, [[j, euclidea(matriz, i, j)]]]);
              } else {
                similiaridades[indice][1].push([j, euclidea(matriz, i, j)])
              }
              break
            case "default":
                alert("Ha habido un error en la elección de la métrica")
                throw new Error();
              break
          }
        }
      }
    }


    for (let i = 0; i < matriz.length; i++) {
      for (let j = 0; j < matriz[i].length; j++) {
        if (matriz[i][j] == "-") {
          let indice = similiaridades.findIndex((elemento) => {
            if (elemento[0] === i) {
              return true;
            }
          })

          let simil_vecinos = JSON.parse(JSON.stringify(similiaridades[indice][1])); // Vector que contendrá la similitud del usuario que tiene el item sin calificar con sus vecinos

          // Orden de las similitudes según la métrica
          switch (metrica) {
            case "Correlación de Pearson":
              simil_vecinos.sort(function (a, b) {
                if (a[1] > b[1]) {
                  return -1;
                } else {
                    if (a[1] < b[1]) {
                      return 1;
                    } else {
                        return 0;
                      }
                  }
              });
              break
            case "Distancia coseno":
              for (let k = 1; k < matriz.length; k++) {
                simil_vecinos.sort(function (a, b) {
                  if (a[1] > b[1]) {
                    return -1;
                  } else {
                      if (a[1] < b[1]) {
                        return 1;
                      } else {
                          return 0;
                        }
                    }
                })
              }
              break
            case "Distancia Euclídea":
              simil_vecinos.sort(function (a, b) {
                if (a[1] < b[1]) {
                  return -1;
                } else {
                    if (a[1] > b[1]) {
                      return 1;
                    } else {
                        return 0;
                      }
                  }
              });
              break
            case "default":
              alert("Ha habido un error en la elección de la métrica")
              throw new Error();
              break
          }


          let aux = [i, j, []] // Vector auxiliar para almacenar los vecinos seleccionados en el calculo de la predicción del usuario i con el item j
          let prediccion = 0
          switch (tipo_pred) {
            case "Predicción simple":
              // For para pushear los vecinos que vamos a utilizar en el vector
              for (let k = 0; k < num_vecinos; k++) {
                // Con este if nos aseguramos de que no se utilice un vecino que no haya calificado ese item para el calculo de la predicción, en el caso de que sea así se saca este vecino del vector y se pasa al siguiente (A no ser que no queden más que en ese caso la predicción se calcularía con un vecino menos)
                if (matriz[simil_vecinos[k][0]][j] == "-") {
                  simil_vecinos.splice(k, 1);
                  k--;
                  continue;
                  
                }

                aux[2].push(simil_vecinos[k][0]);
              }
              
              prediccion = simple(matriz, j, num_vecinos, simil_vecinos) // Calculo de predicción
              calculo_predicciones.push([i, j, prediccion]) // Introducimos el calculo en el vector en formato [usuario, item, valorPrediccion]
              matriz_salida[i][j] = parseInt(prediccion).toFixed(); // Cambiamos el guión por la calificación predecida por ese item en la matriz de utilidad a completar
    
              break

            case "Diferencia con la media":
              for (let k = 0; k < num_vecinos; k++) {
                if (matriz[simil_vecinos[k][0]][j] == "-") {
                  simil_vecinos.splice(k, 1);
                  k--;
                  continue;
                }
                aux[2].push(simil_vecinos[k][0]);
              }

              prediccion = dif_media(matriz, medias_usuarios, i, j, num_vecinos, simil_vecinos)
              calculo_predicciones.push([i, j, prediccion])
              matriz_salida[i][j] = parseInt(prediccion).toFixed();
              break
            case "default":
              alert("Ha habido un error en la elección de la métrica")
              throw new Error();
              break
          }
          
          vecinos_seleccionados.push(aux); // Una vez todos los vecinos seleccionados han sido pusheados en el vector auxiliar, lo introducimos en el vector que contendrá los vecinos seleccionados en cada predicción
        }
      }
    }
    
    return [matriz_salida, similiaridades, vecinos_seleccionados, calculo_predicciones];
  }



  // Función a la que se llama desde el html, recoge los datos y muestra la salida
  function tratar_datos() {
    if (matriz_entrada.length == 0) { // Comprobamos si la matriz se ha recogido del fichero correctamente
      alert("La matriz no se ha podido procesar correctamente");
      throw new Error();
    } else { 
      numero_vecinos = document.getElementById("numero_vecinos").value

      let alerta = "Se está escogiendo un número de vecinos mayor que usuarios existentes (Número de vecinos: " + numero_vecinos.toString() + ", Número máximo de vecinos posibles: " + (matriz_entrada.length-1).toString() +")"
      if (numero_vecinos > matriz_entrada.length-1) { // Comprobamos si el número de vecinos escrito es posible
        alert(alerta);
        throw new Error();
      } else {

        metrica = document.getElementById("metrica").value
        tipo_prediccion = document.getElementById("tipo_prediccion").value

        let salida = "<b>Matriz completa</b><br>"
        let salida_syr = completar_matriz(matriz_entrada, metrica, numero_vecinos, tipo_prediccion) // Realizamos la función del sistema de recomendación

        // Ajustamos la salida y la mostramos por pantalla
        for (let i = 0; i < salida_syr[0].length; i++) {
          for (let j = 0; j < salida_syr[0][i].length; j++) {
            if (j > 0) {
              if (matriz_entrada[i][j] === "-") {
                salida = salida + " " + "<b>" + salida_syr[0][i][j] + "</b>"
              } else {
                salida = salida + " " + salida_syr[0][i][j]
              }
            } else {
              if (matriz_entrada[i][j] === "-") {
                salida = salida + "<b>" + salida_syr[0][i][j] + "</b>"
              } else {
                salida = salida + salida_syr[0][i][j]
              }
            }
          }
          salida = salida + "<br>"
        }

        salida = salida + "<br><br><b>Similiaridad entre cada usuario y sus vecinos de acuerdo a la métrica '" + metrica + "'</b><br>"
        
        for (let i = 0; i < salida_syr[1].length; i++) {
          salida = salida + "· Usuario " + parseInt(salida_syr[1][i][0]) + ":"
          for (let j = 0; j < salida_syr[1][i][1].length; j++) {
            salida = salida + "<br>Usuario " + salida_syr[1][i][0] + " - Usuario " + salida_syr[1][i][1][j][0] + ": <b>" + salida_syr[1][i][1][j][1] + "</b>"
          }
          salida = salida + "<br>"
        }
        
        salida = salida + "<br><br><b>Vecinos seleccionados en el proceso de predicción</b><br>"

        for (let i = 0; i < salida_syr[2].length; i++) {
          salida = salida + "· Predicción de la calificación Usuario " + (parseInt(salida_syr[2][i][0])+1) + "- Item " + (parseInt(salida_syr[2][i][1])+1) + "):<br>Usuarios "
          for (let j = 0; j < salida_syr[2][i][2].length; j++) {
            if (j > 0) {
              if (j == salida_syr[2][i][2].length-1) {
                salida = salida + " y <b>" + (parseInt(salida_syr[2][i][2][j])+1) + "</b>"
              } else {
                salida = salida + ", <b>" + (parseInt(salida_syr[2][i][2][j])+1) + "</b>"
              }
            } else {
              salida = salida + "<b>" + (parseInt(salida_syr[2][i][2][j])+1) + "</b>"
            }
          }
          salida = salida + "<br>"
        }

        salida = salida + "<br><br><b>Cálculo de cada predicción de la matriz de utilidad en base a los vecinos seleccionados</b><br>"

        for (let i = 0; i < salida_syr[3].length; i++) {
          salida = salida + "· Predicción de la calificación Usuario " + (parseInt(salida_syr[3][i][0])+1) + "- Item " + (parseInt(salida_syr[3][i][1])+1) + ": <b>" + salida_syr[3][i][2] + "</b><br>"
        }

        salida = salida + "<br><br>"
        document.getElementById("salida").innerHTML = salida
      }
    }
  }

