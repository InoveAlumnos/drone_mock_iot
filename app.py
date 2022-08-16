'''
Inove Drone Mock Python IoT
---------------------------
Autor: Inove Coding School
Version: 1.0
 
Descripcion:
Se utiliza Flask para crear un generador de datos
de telemetría simulando un Drone:
- Motores
- Luz ON/OFF
- Acelerómetro
- Giróscopo
- GPS

Ejecución: Lanzar el programa y abrir en un navegador la siguiente dirección URL
https://IP:5006/
'''

__author__ = "Inove Coding School"
__email__ = "alumnos@inove.com.ar"
__version__ = "1.0"

import traceback
import json

from flask import Flask, request, jsonify, render_template, redirect
from flask_socketio import SocketIO
from flask_socketio import send, emit

app = Flask(__name__)
app.secret_key = 'ptSecret'
app.config['SECRET_KEY'] = 'ptSecret'
socketio = SocketIO(app)

# ---- MQTT ----
import paho.mqtt.client as mqtt
client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    print("MQTT Conectado")
    client.subscribe("actuadores/volar")
    client.subscribe("actuadores/luces/#")
    client.subscribe("actuadores/motores/#")
    # Topicos de mensajes recibidos del dashobard
    client.subscribe("dashboardiot/actuadores/volar")
    client.subscribe("dashboardiot/actuadores/luces/#")
    client.subscribe("dashboardiot/actuadores/motores/#")

def mqtt_connect():
    if client.is_connected() is False:
        try:
            client.connect("localhost", 1883, 10)
            print("Conectado al servidor MQTT")
            client.loop_start()
        except:
            print("No pudo conectarse")


def on_message(client, userdata, msg):
    topic = str(msg.topic)
    value = str(msg.payload.decode("utf-8"))
    if topic == "actuadores/volar"  or topic == "dashboardiot/actuadores/volar":
        socketio.emit('volar', int(value))
    
    # NOTA: Podría mejorarse el manejo del ID
    # utilizando regular expression (re)
    # Se deja de esta manera para que se vea
    # facil para el alumno
    if topic == "actuadores/luces/1" or topic == "dashboardiot/actuadores/luces/1":
        socketio.emit('luz_1', int(value))
    if topic == "actuadores/motores/1"  or topic == "dashboardiot/actuadores/motores/1":
        socketio.emit('motor_1', int(value))
    if topic == "actuadores/motores/2"  or topic == "dashboardiot/actuadores/motores/2":
        socketio.emit('motor_2', int(value))
    if topic == "actuadores/motores/3"  or topic == "dashboardiot/actuadores/motores/3":
        socketio.emit('motor_3', int(value))
    if topic == "actuadores/motores/4"  or topic == "dashboardiot/actuadores/motores/4":
        socketio.emit('motor_4', int(value))


# ---- Endpoints ----
@app.route('/')
def home():
    mqtt_connect()
    return render_template('index.html')


@app.route('/luces/1/<val>')
def light(val):
    socketio.emit('luz_1', int(val))
    return f"luz: {val}"

# ---- Web sockets contra el frontend ----
@socketio.on('sensores_event')
def ws_sensores_event(data):
    client.publish("sensores/inerciales", json.dumps(data["inerciales"]))
    client.publish("sensores/gps", json.dumps(data["gps"]))


@socketio.on('luz_event')
def ws_luz_event(data):
    # data --> estado de la luz_1 (0 o 1), pasar a int
    client.publish("actuadores/luces/1", int(data))


@socketio.on('volar_event')
def ws_volar_event(data):
    # data --> estado de la volar (0 o 1), pasar a int
    client.publish("actuadores/volar", int(data))


@socketio.on('motores_event')
def ws_motores_event(data):
    # data --> lista de estado de los motores, pasar a int c/u
    for i in range(4):
        client.publish(f"actuadores/motores/{i+1}", int(data[i]))


@socketio.on('joystick_event')
def ws_joystick_event(data):
    # data --> diccionario de estado del joystick, enviar como JSON string
    client.publish(f"actuadores/joystick", json.dumps(data))


if __name__ == "__main__":
    client.on_connect = on_connect
    client.on_message = on_message

    app.run(debug=True, host="0.0.0.0", port=5006)
