define("ClientMessageBridge", ["ConfigurationConstants"],
    function(ConfigurationConstants) {
        return {
            messages: {
                "CreatedBroadcast": {
                    "mode": Terrasoft.MessageMode.BROADCAST,
                    "direction": Terrasoft.MessageDirectionType.PUBLISH
                }
            },
            methods: {
                init: function() {
                    this.callParent(arguments);
                    this.addMessageConfig({
                        sender: "CreatedBroadcast",
                        messageName: "CreatedBroadcast"
                    });
                },
                afterPublishMessage: function(
                    sandboxMessageName,
                    webSocketBody,
                    result,
                    publishConfig) {
                    	
                    if (sandboxMessageName === "CreatedBroadcast") {
                    	this.sandbox.publish("CreatedBroadcast", null,["CreatedBroadcast"]);
                    }
                }
            }
        };
    });