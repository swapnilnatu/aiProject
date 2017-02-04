const restify = require('restify')
const InitClient = require('initai-node')
const projectLogicScript = require('./behavior/scripts')
const server = restify.createServer()
const PORT = process.env.PORT || 4044

server.use(restify.bodyParser())

/**
 * Add a POST request handler for webhook invocations
 */
server.post('/', (req, res, next) => {
  const eventType = req.body.event_type
  const eventData = req.body.data

  // Handle the LogicInvocation event type
    if (eventType === 'LogicInvocation') {
    const initNodeClient = InitClient.create(eventData, {
      succeed(result) {
        sendLogicResult(eventData.payload, result)
      }
    })

    projectLogicScript.handle(initNodeClient)
  }

  // Immediately return a 200 to acknowledge receipt of the Webhook
  res.send(200)
})

/**
 * Start the server on the configured port (default is 4044)
 */
server.listen(PORT, () => {
  console.log('%s listening at %s', server.name, server.url)
})