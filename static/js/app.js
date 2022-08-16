// ---- Estructura de datos ----
let data = {
    luz: 0,
    volar: 0,
    motores: [0, 0, 0, 0],
    joystick: {x: 0, y: 0},
    inerciales: {heading: 0, accel: 0},
    gps: {latitude: -34.55, longitude: -58.496},
    monitoreo: {temp: 0, ram:0, cpu:0}   
}

let socket_connected = false;

// ---- Elementos del HTML ----
const drone = document.getElementById("drone");
const motor1 = document.querySelector("#motor1");
const motor2 = document.querySelector("#motor2");
const motor3 = document.querySelector("#motor3");
const motor4 = document.querySelector("#motor4");

const light = document.getElementById("droneLight");

const slight = document.querySelector("#slight");
light.style.opacity = 0;

const m1 = document.querySelector("#sM1");
const m2 = document.querySelector("#sM2");
const m3 = document.querySelector("#sM3");
const m4 = document.querySelector("#sM4");

m1.disabled = true;
m2.disabled = true;
m3.disabled = true;
m4.disabled = true;

// --- Funciones de ayuda ----
function updateEngineState(state) {
    if(state == true) {
        data.volar = 1;
        data.motores[0] = 1;
        m1.checked = true;
        m1.disabled = false;
        data.motores[1] = 1;
        m2.checked = true;
        m2.disabled = false;
        data.motores[2] = 1;
        m3.checked = true;
        m3.disabled = false;
        data.motores[3] = 1;
        m4.checked = true;
        m4.disabled = false;
    } else {
        data.volar = 0;
        data.motores[0] = 0;
        m1.checked = false;
        m1.disabled = true;
        data.motores[1] = 0;
        m2.checked = false;
        m2.disabled = true;
        data.motores[2] = 0;
        m3.checked = false;
        m3.disabled = true;
        data.motores[3] = 0;
        m4.checked = false;
        m4.disabled = true;
    }
}

function rotate() {
    x = data.joystick.y > 0? data.joystick.y * 60 : 0;
    y = data.joystick.x * 60 + 180;
    z = (-data.inerciales.heading);
    drone.style.webkitTransform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
    drone.style.MozTransform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
    drone.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
}

function update() {
    data.motores[0] == true ? motor1.classList.add("propeller--on") : motor1.classList.remove("propeller--on");
    data.motores[1] == true ? motor2.classList.add("propeller--on") : motor2.classList.remove("propeller--on");
    data.motores[2] == true ? motor3.classList.add("propeller--on") : motor3.classList.remove("propeller--on");
    data.motores[3] == true ? motor4.classList.add("propeller--on") : motor4.classList.remove("propeller--on");
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function sendActuadorUpdate(actuador) {
    if (socket_connected == true){
        if(actuador == "volar") {
            socket.emit("volar_event", data.volar);
        }
        if(actuador == "luz") {
            socket.emit("luz_event", data.luz);
        }
        if(actuador == "motores") {
            socket.emit("motores_event", data.motores);
        }
        if(actuador == "joystick") {
            socket.emit("joystick_event", data.joystick);
        }
    }
}

// ---- Instanciar elementos HTML y conectar eventos ----

// https://www.codehim.com/text-input/round-range-slider-html-control-in-jquery/#:~:text=The%20plugin%2C%20%E2%80%9CroundSlider%E2%80%9D%20is,build%20with%20CSS%20and%20JavaScript.
// https://roundsliderui.com/document.html
$("#heading").roundSlider({
    sliderType: "min-range",
    value: 0,
    max : 360,
    startAngle: "+90",
    endAngle : "+360",
    drag: function(e) {
        var angle = e.value;
        data.inerciales.heading = angle;
        rotate();
    },
    change: function(e) {
        var angle = e.value;
        data.inerciales.heading = angle;
        rotate();
    }
});
$("#accel").roundSlider({
    sliderType: "min-range",
    value: 0,
    max : 20,
    step: 0.2,        
    startAngle: "+90",
    endAngle : "+360",
    drag: function(e) {
        var angle = e.value;
        data.inerciales.accel = angle;
        rotate();
    },
    change: function(e) {
        var angle = e.value;
        data.inerciales.accel = angle;
        rotate();
    }
});

document.querySelector("#latitude").value = data.gps.latitude;
document.querySelector("#latitude").onchange = (e) => {
    if(isNumeric(e.target.value) == true) {
        data.gps.latitude = parseFloat(e.target.value);
    }
};

document.querySelector("#longitude").value = data.gps.longitude;
document.querySelector("#longitude").onchange = (e) => {
    if(isNumeric(e.target.value) == true) {
        data.gps.longitude = parseFloat(e.target.value);
    }
};

joystick.ondrag = function(){
    data.joystick.x = this.shaft.current.abs_vector.x;
    data.joystick.y = this.shaft.current.abs_vector.y;
    rotate();
    sendActuadorUpdate("joystick");
}

m1.onchange = (e) => {
    data.motores[0] = e.target.checked;
    update();
    sendActuadorUpdate("motores");
}
m2.onchange = (e) => {
    data.motores[1] = e.target.checked;
    update();
    sendActuadorUpdate("motores");
}
m3.onchange = (e) => {
    data.motores[2] = e.target.checked;
    update();
    sendActuadorUpdate("motores");
}
m4.onchange = (e) => {
    data.motores[3] = e.target.checked;
    update();
    sendActuadorUpdate("motores");
}

slight.onchange = (e) => {
    const val = e.target.checked ? 1 : 0;
    data.luz = val;
    light.style.opacity = val;
    sendActuadorUpdate("luz");
}
const sengine = document.querySelector("#sengine");
sengine.onchange = (e) => {
    updateEngineState(e.target.checked);
    update();
    sendActuadorUpdate("volar");
    sendActuadorUpdate("motores");
}

// ---- Web sockets contra el backend ----
let socket = io();
socket.on("connect", function() {
    socket_connected = true;
    socket.on('luz_1', function (msg) {
        const val = Number(msg);
        data.luz = val;
        light.style.opacity = val;
        slight.checked = val;
    });
    socket.on('volar', function (msg) {
        const val = Number(msg);
        sengine.checked = val;
        updateEngineState(val);
        update();
    });
    socket.on('motor_1', function (msg) {
        // Si el está activado el vuelo
        // permito actualizar el estado del motor
        if(data.volar == true) {
            const val = Number(msg);
            data.motores[0] = val;
            m1.checked = val;
            update();
        }
    });
    socket.on('motor_2', function (msg) {
        // Si el está activado el vuelo
        // permito actualizar el estado del motor
        if(data.volar == true) {
            const val = Number(msg);
            data.motores[1] = val;
            m2.checked = val;
            update();
        }
    });
    socket.on('motor_3', function (msg) {
        // Si el está activado el vuelo
        // permito actualizar el estado del motor
        if(data.volar == true) {
            const val = Number(msg);
            data.motores[2] = val;
            m3.checked = val;
            update();
        }
    });
    socket.on('motor_4', function (msg) {
        // Si el está activado el vuelo
        // permito actualizar el estado del motor
        if(data.volar == true) {
            const val = Number(msg);
            data.motores[3] = val;
            m4.checked = val;
            update();
        }
    });
});


(function my_func() {
    if (socket_connected == true){
        socket.emit("sensores_event", data);
    }
    setTimeout( my_func, 500 );
})();
