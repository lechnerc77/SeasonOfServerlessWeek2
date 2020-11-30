# Season of Serverless - Challenge Week 2
This repository contains the solution for the Season of Serverless Challenge week 2 aka "Lovely Ladoos" via Azure Functions in TypeScript

## Solution Components

The solution consists of a trained model of Custom Vision in Azure. The model is trained to recognize ladoo, cake (well let's be honest it recognizes apple pie ... but is there other cake?) and doughnuts.
The model is exposed via an API. The API is encapsulated in an Azure Function. The Azure Function accepts URLs of an image in the JSON body of the request.  

## Internal Design

The Azure Functions executes the following steps:

* It checks if an URL was passed via the request body. If this is not the case an HTTP 400 is returned
* If an URL is passed to the function it delegates the image classification to the pre-trained Custom Vision model in Azure.
* It returns the results to the caller, namely the tags as well as the probability of the aforementioned sweets.

The keys and identifiers for the call of the Custom Vision API are stored in the App Settings and the `local.settings.json` file. The function has the authorization level anonymous.

The original task was to provision the image via file upload, but this makes the call in Azure a bit cumbersome, which is the reason why this solution focuses on the URL-based provisioning of pictures. However, the code contains the relevant calls to read a file form the files system and the call of the Custom Vision API.

## How to execute

You cannot run the function locally, as the keys for the Custom Vision API are not pushed to this repository. The API is provisioned on Azure at the endpoint `https://seasonofserverlessweek2.azurewebsites.net/api/LovelyLadoosClassifier`. Some sample HTTP calls of the are available in the file `demorequests.http` (required: [REST CLient extension in VSCode](https://marketplace.visualstudio.com/items?itemName=humao.rest-client))
