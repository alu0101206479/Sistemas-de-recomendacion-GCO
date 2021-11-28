# Sistemas de recomendación
## ACOIDAN MESA HERNANDEZ - [alu0101206479@ull.edu.es](alu0101206479@ull.edu.es)

### Descripción del código desarrollado

Se ha desarrollado un código en ```HTML``` y ```Javascript```, este código consta de un fichero HTML con un formulario con 4 inputs:

  * La selección del fichero que contiene la matriz
  * La métrica a usar para calcular las similitudes (Coeficiente de Pearson, Distancia Coseno o Distancia Euclídea)
  * El número de vecinos a usar en la predicción
  * EL tipo de predicción a utilizar (Predicción simple o Diferencia con la media)

Este formulario consta de un botón que cuando se pulsa llama a una función del codigo de Javascript.

El fichero de Javascript consta de las siguientes funciones:

  * ```tratar_datos()```: Función a la que se llama desde el html, recoge los datos y muestra las salidas correspondientes
  * ```sistema_recomendacion(matriz, metrica, num_vecinos, tipo_pred)```: Función principal del programa, esta función es la que llama a todas las demás y la que se encarga de completar la matriz de predicciones, calcular todas las similitudes, todas las predicciones...
  * ```calculo_medias(matriz, i)```: Función que calcula las medias de las calificaciones de los items de todos los usuarios de la matriz y las retorna en forma de vector
  * ```correlacion_pearson(matriz, medias, usuario1, usuario2)```: Función que calcula las similitud entre dos usuarios a través del "Coeficiente de Pearson"
  * ```coseno(matriz, usuario1, usuario2)```: Función que calcula la similitud entre dos usuarios a través de la "Distancia Coseno"
  * ```euclidea(matriz, usuario1, usuario2)```: Función que calcula la similitud entre dos usuarios a través de la "Distancia Euclídea"
  * ```simple(matriz, item, num_vecinos, similitudes)```: Función que calcula la predicción de la calificación de un usuario a un item con tipo de predicción "Simple"
  * ```dif_media(matriz, medias, u, item, num_vecinos,  similitudes)```: Función que calcula la predicción de la calificación de un usuario a un item con tipo de predicción "Diferencia con la media"

A parte de estas funciones en el fichero de Javascript también hay un manejador para el evento ```change``` del input en el que se selecciona el fichero que contiene la matriz, para obtener dicha matriz de este y almacenarla en una variable.

### Ejemplo de uso

Parametros de entrada:
  
  * Fichero: Seleccionar un fichero que contenga la siguiente matriz (Nos tenemos que asegurar que esta solo contenga espacios entre medio de los números, y no espacios ni al final ni al principio de cada fila):  
    5 3 4 4 -  
    3 1 2 3 3  
    4 3 4 3 5  
    3 3 1 5 4  
    1 5 5 2 1  
  * Métrica: Correlación de Pearson
  * Número de vecinos (No puede ser mayor al número de vecinos posibles y tiene que ser 3 o mayor si se escoge como tipo de predicción "Predicción simple"): 2
  * Tipo de predicción: Diferencia con la media

Salida:
  
**Matriz completa**  
  5 3 4 4 5  
  3 1 2 3 3  
  4 3 4 3 5  
  3 3 1 5 4  
  1 5 5 2 1  

**Similiaridad entre cada usuario y sus vecinos de acuerdo a la métrica 'Correlación de Pearson'**  
  * Usuario 1:
  Usuario 1 - Usuario 2: **0.84**
  Usuario 1 - Usuario 3: **0.61**
  Usuario 1 - Usuario 4: **0**
  Usuario 1 - Usuario 5: **-0.77**
  * Usuario 2:
  Usuario 2 - Usuario 1: **0.84**
  Usuario 2 - Usuario 3: **0.47**
  Usuario 2 - Usuario 4: **0.49**
  Usuario 2 - Usuario 5: **-0.9**
  * Usuario 3:
  Usuario 3 - Usuario 1: **0.61**
  Usuario 3 - Usuario 2: **0.47**
  Usuario 3 - Usuario 4: **-0.16**
  Usuario 3 - Usuario 5: **-0.47**
  * Usuario 4:
  Usuario 4 - Usuario 1: **0**
  Usuario 4 - Usuario 2: **0.49**
  Usuario 4 - Usuario 3: **-0.16**
  Usuario 4 - Usuario 5: **-0.64**
  · Usuario 5:
  Usuario 5 - Usuario 1: **-0.77**
  Usuario 5 - Usuario 2: **-0.9**
  Usuario 5 - Usuario 3: **-0.47**
  Usuario 5 - Usuario 4: **-0.64**

**Vecinos seleccionados en el proceso de predicción**  
  * Predicción de la calificación Usuario 1 - Item 5:
  Usuarios **2**, **3** y **4**

**Cálculo de cada predicción de la matriz de utilidad en base a los vecinos seleccionados**
  * Predicción de la calificación Usuario 1 - Item 5: **3.841379310344828**