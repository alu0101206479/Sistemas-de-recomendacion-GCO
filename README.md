# Sistemas de recomendación
## ACOIDAN MESA HERNANDEZ - [alu0101206479@ull.edu.es](alu0101206479@ull.edu.es)

### Explicación del código

Se ha desarrollado un código en ```HTML``` y ```Javascript```, este código consta de un fichero HTML con un formulario con 4 inputs:

  * La selección del fichero que contiene la matriz
  * La métrica a usar para calcular las similitudes (Coeficiente de Pearson, Distancia Coseno o Distancia Euclídea)
  * El número de vecinos a usar en la predicción
  * EL tipo de predicción a utilizar (Predicción simple o Diferencia con la media)

Este formulario consta de un botón que cuando se pulsa llama a una función del codigo de Javascript.

El fichero de Javascript consta de las siguientes funciones:

  * javascript```tratar_datos()```: Función a la que se llama desde el html, recoge los datos y muestra las salidas correspondientes
  * javascript```completar_matriz(matriz, metrica, num_vecinos, tipo_pred)```: Función principal del programa, esta función es la que llama a todas las demás y la que se encarga de completar la matriz de predicciones, calcular todas las similitudes, todas las predicciones...
  * javascript```calculo_medias(matriz, i)```: Función que calcula las medias de las calificaciones de los items de todos los usuarios de la matriz y las retorna en forma de vector
  * javascript```coeficiente_pearson(matriz, medias, usuario1, usuario2)```: Función que calcula las similitud entre dos usuarios a través del "Coeficiente de Pearson"
  * javascript```coseno(matriz, usuario1, usuario2)```: Función que calcula la similitud entre dos usuarios a través de la "Distancia Coseno"
  * javascript```euclidea(matriz, usuario1, usuario2)```: Función que calcula la similitud entre dos usuarios a través de la "Distancia Euclídea"
  * javascript```simple(matriz, item, num_vecinos, similitudes)```: Función que calcula la predicción de la calificación de un usuario a un item con tipo de predicción "Simple"
  * javascript```dif_media(matriz, medias, u, item, num_vecinos,  similitudes)```: Función que calcula la predicción de la calificación de un usuario a un item con tipo de predicción "Diferencia con la media"

A parte de estas funciones en el fichero de Javascript también hay un manejador para el evento ```change``` del input en el que se selecciona el fichero que contiene la matriz para obtener dicha matriz de este y almacenarla en una variable.

### Ejemplo de uso

Parametros de entrada:

  * Fichero: Seleccionar un fichero que contenga la siguiente matriz (Nos tenemos que asegurar que esta solo contenga espacios entre medio de los números, y no espacios ni al final ni al principio de cada fila):
    5 3 4 4 -\n
    3 1 2 3 3\n
    4 3 4 3 5\n
    3 3 1 5 4\n
    1 5 5 2 1\n
  * Métrica: Correlación de Pearson
  * Número de vecinos: 2
  * Tipo de predicción: Diferencia con la media

Salida:


