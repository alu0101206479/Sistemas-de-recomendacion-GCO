var fichero = document.getElementById('fichero')
var matriz_entrada = []

fichero.addEventListener('change', function(e) {
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

  function simple(matriz, u, item, n_vecinos, similitudes) {
    if (n_vecinos < 3) {
      console.error("ERROR: EL número elegido de vecinos es demasiado pequeño para validar")
        console.log("Minimo 3 vecinos")
    } else {
      let numerador = 0;
      let denominador = 0;       
      for (let k = 0; k < n_vecinos; k++) {
        numerador = numerador + (similitudes[k][1]*parseInt(matriz[similitudes[k][0]][item]))
        denominador = denominador + Math.abs(similitudes[k][1])
      }

      let resultado = parseInt(numerador/denominador).toString();

      return resultado;
    }
  }

  function medida(matriz, u, item, n_vecinos,  similitudes) {
    let numerador = 0;
    let denominador = 0;

    let vec_aux = matriz[u].filter(function(x) {
      return x !== "-";
    })

    let sumatorio_u = 0;
    for (let k = 0; k < vec_aux.length; k++) {
      sumatorio_u = sumatorio_u + parseInt(vec_aux[k])
    }

    let media_u = sumatorio_u/vec_aux.length

    for (let k = 0; k < n_vecinos; k++) {
      let vec_aux2 = matriz[similitudes[k][0]].filter(function(x) {
        return x !== "-";
      })

      let sumatorio_v = 0

      for (let l = 0; l < vec_aux2.length; l++) {
        sumatorio_v = sumatorio_v + parseInt(vec_aux2[l])
      }

      let media_v = sumatorio_v/vec_aux2.length

      numerador = numerador + (similitudes[k][1] * (parseInt(matriz[similitudes[k][0]][item]) - media_v))
      denominador = denominador + Math.abs(similitudes[k][1])
    }

    let resultado = (media_u + numerador/denominador).toFixed()

    return resultado;
  }

  function pearson(matriz, vecino1, vecino2) {
    let vec_aux = []

    for (let i = 0; i < matriz[vecino1].length; i++) {
      if (matriz[vecino1][i] != "-" && matriz[vecino2][i] != "-") {
        vec_aux.push(i)
      }
    }

    let media_v1 = 0
    let media_v2 = 0

    let sumatorio_v1 = 0
    let sumatorio_v2 = 0
    for (let i = 0; i < vec_aux.length; i++) {
      sumatorio_v1 = sumatorio_v1 + parseInt(matriz[vecino1][vec_aux[i]])
      sumatorio_v2 = sumatorio_v2 + parseInt(matriz[vecino2][vec_aux[i]])
    }

    media_v1 = sumatorio_v1/vec_aux.length
    media_v2 = sumatorio_v2/vec_aux.length

    let numerador = 0
    let den_1 = 0
    let den_2 = 0
    for (let i = 0; i < vec_aux.length; i++) {
      numerador = numerador + ((parseInt(matriz[vecino1][vec_aux[i]])-media_v1)*(parseInt(matriz[vecino2][vec_aux[i]])-media_v2))

      den_1 = den_1 + Math.pow(parseInt(matriz[vecino1][vec_aux[i]])-media_v1,2)
      den_2 = den_2 + Math.pow(parseInt(matriz[vecino2][vec_aux[i]])-media_v2,2)
    }

    den_1 = Math.sqrt(den_1)
    den_2 = Math.sqrt(den_2)
    let denominador = den_1*den_2

    let resultado = parseFloat((numerador/denominador).toFixed(2))

    return resultado

  }

  function coseno(matriz, vecino1, vecino2) {
    let vec_aux = []
    for (let i = 0; i < matriz[vecino1].length; i++) {
      if (matriz[vecino1][i] != "-" && matriz[vecino2][i] != "-") {
        vec_aux.push(i)
      }
    }

    let numerador = 0
    let den_1 = 0
    let den_2 = 0
    for (let i = 0; i < vec_aux.length; i++) {
      numerador = numerador+(parseInt(matriz[vecino1][vec_aux[i]])*parseInt(matriz[vecino2][vec_aux[i]]))

      den_1 = den_1+Math.pow(parseInt(matriz[vecino1][vec_aux[i]]), 2)
      den_2 = den_2+Math.pow(parseInt(matriz[vecino2][vec_aux[i]]), 2)
    }

    den_1 = Math.sqrt(den_1)
    den_2 = Math.sqrt(den_2)
    let denominador = den_1*den_2

    let resultado = parseFloat((numerador/denominador).toFixed(2))

    return resultado
  }

  function euclidea(matriz, vecino1, vecino2) {
    let vec_aux = []
    for (let i = 0; i < matriz[vecino1].length; i++) {
      if (matriz[vecino1][i] != "-" && matriz[vecino2][i] != "-") {
        vec_aux.push(i)
      }
    }

    let resultado = 0
    for (let i = 0; i < vec_aux.length; i++) {
      resultado = resultado+(parseInt(matriz[vecino1][vec_aux[i]])-parseInt(matriz[vecino2][vec_aux[i]]))
    }

    resultado = parseInt(Math.sqrt(resultado).toFixed(2))

    return resultado
  }


  function completar_matriz(matriz, metrica, n_vecinos, tipo_pred) {
    let matriz_salida = matriz.slice();

    for (let i = 0; i < matriz_salida.length; i++) {
      for (let j = 0; j < matriz_salida[i].length; j++) {
        if (matriz_salida[i][j] == "-") {

          let similitud = [];
    
          switch (metrica) {
            case "pearson":
              for (let k = 1; k < matriz_salida.length; k++) {
                similitud.push([(k+i)%matriz_salida.length, pearson(matriz_salida, i, (k+i)%matriz_salida.length)])
              }
              break
            case "coseno":
              for (let k = 1; k < matriz_salida.length; k++) {
                similitud.push([(k+i)%matriz_salida.length, coseno(matriz_salida, i, (k+i)%matriz_salida.length)])            }
              break
            case "euclidea":
              for (let k = 1; k < matriz_salida.length; k++) {
                similitud.push([(k+i)%matriz_salida.length, euclidea(matriz_salida, i, (k+i)%matriz_salida.length)])
              }
              break
            case "default":
                console.error("ERROR: No se ha proporcionado ninguna metrica valida")
                console.log("Metricas validas = [pearson, coseno, euclidea]")
              break
          }
    
          similitud.sort(function (a, b) {
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

          switch (tipo_pred) {
            case "simple":
              matriz_salida[i][j] = simple(matriz_salida, i, j, n_vecinos, similitud)
    
              break
            case "medida":
             matriz_salida[i][j] = medida(matriz_salida, i, j, n_vecinos, similitud)

              break
            case "default":
                console.error("ERROR: No se ha proporcionado ninguna metrica valida")
                console.log("Metricas validas = [pearson, coseno, euclidea]")
              break
          }

          return matriz_salida;
        }
      }
    }
  }

  function recoger_informacion() {

    if (matriz_entrada.length == 0) {
      alert("La matriz no se ha podido procesar correctamente");
    } else {
        metrica = document.getElementById("metrica").value
        numero_vecinos = document.getElementById("numero_vecinos").value
        tipo_prediccion = document.getElementById("tipo_prediccion").value

        let salida = "<b>Matriz completa</b><br>"
        document.getElementById("salida").innerHTML = completar_matriz(matriz_entrada, metrica, numero_vecinos, tipo_prediccion)
    }


    //console.log(matriz_entrada, )
  }

