![logotipo](inove.jpg)
# Drone Mock
### Simuladorde datos de un Drone basado en Flask

Este es un proyecto realizado por miembros de inove como un servicio para incorporar telemetría de los sensores de un drone para el programa de ejemplos del curso de Python IoT.

# Comenzando 🚀
El objetivo de este proyecto es dar un ejemplo de aplicación de Python en la generación de datos de sensores y actuadores del tipo IoT. Este proyecto se basa en tomar la telemetría generada y compartir dicha información por mqtt.

URL pasa su uso:
```sh
http://<ip_host_flask>:5006
```

# Pre-requisitos 📋
Para poder ejecutar esta aplicación, será necesario tener instalada la versión 3.7 de Python o superior.\
Instale las librerias que se comentan en requirements.txt

# Tópicos de MQTT
Por defecto la aplicación busca conectarse a un broker MQTT local (localhost) en el puerto 1883. Los datos de telemetría de los sensores de la aplicación son:
```
sensores/inericiales
sensores/gps
```
Ejemplo usando mosquitto sub:
```sh
$ mosquitto_sub -t "sensores/inericiales"
```

Puede controlar el estado de la luz del drone (ON=1, OFF=0) o desl sisetma de vuelo y motores se realiza desde lossiguientes tópicos:
```
actuadores/luces/1
actuadores/vuelo
actuadores/motores/1
actuadores/motores/2
actuadores/motores/3
actuadores/motores/4
```
Ejemplo usando mosquitto pub:
```sh
$ mosquitto_pub -t "actuadores/luces/1" -m 1
```

# Instalación y pruebas 🔧⚙️
Una vez levantado el server, deberá conocer la IP del servidor en su red local para poder ingresar:
```ssh
http://<ip_host_flask>:5005
```
Inmediatamente después podrá ver en su MQTT broker la telemetría que evoluciona a medida que interactua con el sistema. Los comandos para ver los mensajes que llegan y como controlar los actuadores por mqtt se encuentran en la sección anterior.

# Autores ✒️
### Miembros de Inove (coding school)
:octocat: Hernán Contigiani\
:octocat: Hector Vergara\
:octocat: Javier Carguno

# Licencia 📄
Este proyecto está bajo la Licencia de Inove (coding school) para libre descarga y uso. Este proyecto tiene un propósito educativo y de muestra, por ello, no nos responsabilizaremos por su uso indebido. Así mismo, no existe garantía en su implementación debido a que se trata de una demostración de uso gratuito con propósitos educativos. 
### :copyright: Inove (coding school) 2022.
