/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const hechos = require('./facts'); // ahora la constante "hechos" es el arreglo que representa la base de datos del archivo "facts.js"

const menuAPL = require('./documents/menuAPL.json');
const menudata = require('./documents/menuData.json');

const plantillaAPL = require('./documents/plantillaAPL.json');
const plantillaData = require('./documents/plantillaData.json');

const despedidaAPL = require('./documents/despedidaAPL.json');
const despedidaData = require('./documents/despedidaData.json');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Hola. <amazon:emotion name="excited" intensity="high">Bienvenido.</amazon:emotion> Dime un tema que te gustaría saber.';
        
        const supportAPL = handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL'] ? true : false;
        
        if(supportAPL){
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.4',
                document: menuAPL,
                datasources: menudata
            });
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Selecciona un texto al azar del listado de "hechos"
const RngFactIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AsistenteGeneralIntent';
    },
    handle(handlerInput) {
        const indiceAleatorio = Math.floor(Math.random() * hechos.length); // numero entre 0 y longitud del arreglo
        const speakOutput = hechos[indiceAleatorio].dato; // seleccionar un texto (propiedad "dato") al azar del arreglo
        
        const supportAPL = handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL'] ? true : false;
        
        const titulo = hechos[indiceAleatorio].tipo;
        const contenido = hechos[indiceAleatorio].res;
        
        plantillaData.headlineTemplateData.properties.textContent.primaryText.text = titulo;
        plantillaData.headlineTemplateData.properties.textContent.secondaryText.text = contenido;
        
        if(supportAPL){
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.4',
                document: plantillaAPL,
                datasources: plantillaData
            });
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput) // reprompt mantiene abierta la sesión a la espera de interacción del usuario
            .getResponse();
    }
};


const MenuIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MenuIntent';
    },
    handle(handlerInput) {
        const speakOutput = "Puedes decirme lee temas para decirte los temas disponibles";
        
        const supportAPL = handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL'] ? true : false;
        
        if(supportAPL){
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.4',
                document: menuAPL,
                datasources: menudata
            });
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput) // reprompt mantiene abierta la sesión a la espera de interacción del usuario
            .getResponse();
    }
};

const ReadTopicsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadTopicsIntent';
    },
    handle(handlerInput) {
        
        var temas = "Los temas disponibles son: ";
        
        hechos.forEach(function(hecho){
            temas = temas + hecho.tipo + ", ";
        });
        
        const speakOutput = temas;
        
        const supportAPL = handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL'] ? true : false;
        
        if(supportAPL){
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.4',
                document: menuAPL,
                datasources: menudata
            });
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput) // reprompt mantiene abierta la sesión a la espera de interacción del usuario
            .getResponse();
    }
};

// Seleccionar un texto al azar según el tema que solicita el usuario.
// Por ejemplo: pedir un dato sobre el tema de "arte"
const RngFactByThemeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AsistenteIntent';
    },
    handle(handlerInput) {
        // Obtener el slot (parámetro) que representa el tema que pide el usuario
        const tema = handlerInput.requestEnvelope.request.intent.slots.tema.resolutions.resolutionsPerAuthority[0].values[0].value.name; // i.e. "naturaleza", "arte", etc.
        
        const supportAPL = handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL'] ? true : false;
        
        let seleccion = []; // Listado vacio que representará el subconjunto de datos del tema específico
        // Iterar sobre mi "bases de datos" y seleccionar solo los del tema que pide el usuario
        hechos.forEach(function(hecho){
            if (hecho.tipo.toLowerCase() === tema.toLowerCase())
                seleccion.push(hecho);
        });
        // seleccionar un hecho al azar del subconjunto ("seleccion") usando la misma estrategia que en la función "RngFactIntentHandler"
        const speakOutput = seleccion[Math.floor(Math.random() * seleccion.length)].dato;
        
        const titulo = seleccion[Math.floor(Math.random() * seleccion.length)].tipo;
        const contenido = seleccion[Math.floor(Math.random() * seleccion.length)].res;
        
        plantillaData.headlineTemplateData.properties.textContent.primaryText.text = titulo;
        plantillaData.headlineTemplateData.properties.textContent.secondaryText.text = contenido;
        
        if(supportAPL){
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.4',
                document: plantillaAPL,
                datasources: plantillaData
            });
        }
        
        

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Puedes preguntarme sobre métodos, atributos, clases e incluso puedes pedirme algún tema aleatorio. También puedes decir lee temas para decirte los temas disponibles.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    
    handle(handlerInput) {
        
        const speakOutput = '<amazon:emotion name="disappointed" intensity="high"> Hasta pronto usuario Codnaow </amazon:emotion>';
        
        const supportAPL = handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL'] ? true : false;
        
        if(supportAPL){
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.4',
                document: despedidaAPL,
                datasources: despedidaData
            });
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Lo siento, no entendí eso. Inténtalo de nuevo.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Lo siento, no pude entender tu solicitud. Intenta de nuevo.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RngFactIntentHandler, // No olvidar agregar los handlers aquí
        RngFactByThemeIntentHandler,
        ReadTopicsIntentHandler,
        HelpIntentHandler,
        MenuIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/select-random/v1.2')
    .lambda();
