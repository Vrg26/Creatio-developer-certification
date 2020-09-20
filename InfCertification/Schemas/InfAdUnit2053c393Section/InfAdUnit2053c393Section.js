define("InfAdUnit2053c393Section", ["ProcessModuleUtilities"], function(ProcessModuleUtilities) {
	return {
		entitySchemaName: "InfAdUnit",
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/,
		messages:{
		},
		methods: {
			runCreateBroadcast: function(){
				const adUnitId = this.get("ActiveRow");
				const args = {
					sysProcessName: "InfProcessAutoCreationBroadcastRecords",
					parameters:{
	        			AdUnit: adUnitId
	        		}
				};
				ProcessModuleUtilities.executeProcess(args);
			},
			isActiveRow: function(){
				const activeRow = this.get("ActiveRow");
				return activeRow;
			},
			getSectionActions: function(){
				var actionsMenuItems = this.callParent(arguments);
				
				actionsMenuItems.addItem(this.getButtonMenuItem({
					"Caption": {bindTo: "Resources.Strings.CreateBroadcast"},
					"Click": {bindTo: "runCreateBroadcast"},
					"Enabled": {bindTo: "isActiveRow"}
				}));
				return actionsMenuItems;
			},
		}
	};
});
