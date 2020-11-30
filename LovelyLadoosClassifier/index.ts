import { AzureFunction, Context, HttpRequest } from "@azure/functions"
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction")
const msRest = require("@azure/ms-rest-js")

/* Additional required package for File Upload
const fs = require('fs')
*/

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    context.log('Lovely Ladoos Classifier started.')

    if (!req.body || !req.body.url) {
        console.log('No URL passed in request')
        context.res = {
            "status": 400,
            "body": "Pass an image URL in the JSON body of your request"
        }

    }
    else {
        const pictureurl = req.body.url

        console.log("Executing classification");

        const predictor_credentials = new msRest.ApiKeyCredentials({ inHeader: { "Prediction-key": process.env["predictionKey"] } })
        const predictor = new PredictionApi.PredictionAPIClient(predictor_credentials, process.env["endPoint"])

        const results = await predictor.classifyImageUrl(process.env["projectID"], process.env["publishIterationName"], { "url": pictureurl })

        /* Alternative approach for uploading files - not supported here
        const testFile = fs.readFileSync(`path/to/test/image.jpg`);
        const results = await predictor.classifyImage(process.env["projectID"], process.env["publishIterationName"], testFile)
        */

        let resultString = `Result of the classification: \n`

        for (let i = 0; i < results.predictions.length; i++) {

            let tag = results.predictions[i].tagName
            let probability = (results.predictions[i].probability * 100.0).toFixed(2)

            let symbol = ''
            switch (tag) {
                case 'Doughnut':
                    symbol = '🍩'
                    break
                case 'Cake':
                    symbol = '🥧'
                    break
                case 'ladoo':
                    symbol = '🔴'
                    break

            }
            //Next time we do it with templates :-)
            resultString = resultString + `\t ` + symbol + ' ' + tag + `: ` + probability + `% \n `
        }

        context.res = {
            "status": 200,
            "body": resultString
        }

    }
};

export default httpTrigger;