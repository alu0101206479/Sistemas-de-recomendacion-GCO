// ((5-4)×(3-2,25))+((3-4)×(1-2,25))+((4-4)×(2-2,25))+((4-4)×(3-2,25))
// √((5-4)²+(3-4)²+(4-4)²+(4-4)²)×√((3-2,25)²+(1-2,25)²+(2-2,25)²+(3-2,25)²)
function pearson(matriz, vecino1, vecino2) {
  let vec_aux = []
  for (i = 0; i < matriz[vecino1].length; i++) {
    if (matriz[vecino1][i] != "-" && matriz[vecino2][i] != "-") {
      vec_aux.push(i)
    }
  }

  let media_v1 = 0
  let media_v2 = 0

  let sumatorio_v1 = 0
  let sumatorio_v2 = 0
  for (i = 0; i < vec_aux.length; i++) {
    sumatorio_v1 = sumatorio_v1 + parseInt(matriz[vecino1][vec_aux[i]])
    sumatorio_v2 = sumatorio_v2 + parseInt(matriz[vecino2][vec_aux[i]])
  }

  media_v1 = sumatorio_v1/vec_aux.length
  media_v2 = sumatorio_v2/vec_aux.length

  let numerador = 0
  let den_1 = 0
  let den_2 = 0
  for (i = 0; i < vec_aux.length; i++) {
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
  for (i = 0; i < matriz[vecino1].length; i++) {
    if (matriz[vecino1][i] != "-" && matriz[vecino2][i] != "-") {
      vec_aux.push(i)
    }
  }

  let numerador = 0
  let den_1 = 0
  let den_2 = 0
  for (i = 0; i < vec_aux.length; i++) {
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
  for (i = 0; i < matriz[vecino1].length; i++) {
    if (matriz[vecino1][i] != "-" && matriz[vecino2][i] != "-") {
      vec_aux.push(i)
    }
  }

  let resultado = 0
  for (i = 0; i < vec_aux.length; i++) {
    resultado = resultado+(parseInt(matriz[vecino1][vec_aux[i]])-parseInt(matriz[vecino2][vec_aux[i]]))
  }

  resultado = parseInt(Math.sqrt(resultado).toFixed(2))
  
  return resultado
}


function recomendador(matriz, metrica, n_vecinos, tipo) {
  for (i = 0; i < matriz.length; i++) {
    for (j = 0; j < matriz[i].length; j++) {
      if (matriz[i][j] == "-") {
        switch (metrica) {
          case "pearson":
            pearson(matriz, 0, 1)
            break
          case "coseno":
            coseno(matriz, 0, 1)
            break
          case "euclidea":
            euclidea(matriz, 0, 1)
            break
          case "default":
              console.error("ERROR: No se ha proporcionado ninguna metrica valida")
              console.log("Metricas validas = [pearson, coseno, euclidea]")
            break
        }
      } 
    }
  }
}

function test() {
  matriz_test = [["5", "3", "4", "4", "-"],
                 ["3", "1", "2", "3", "3"],
                 ["4", "3", "4", "3", "4"],
                 ["3", "3", "1", "5", "4"],
                 ["1", "5", "5", "2", "1"]]
  n_vecinos_test = 2
  tipo_test = "simple"
  metrica_test = "euclidea"

  console.log(recomendador(matriz_test, metrica_test, n_vecinos_test, tipo_test))
}
