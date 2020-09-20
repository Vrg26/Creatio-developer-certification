define("InfBroadcastDetail", ["ConfigurationGrid", "ConfigurationGridGenerator",
    "ConfigurationGridUtilities"], function() {
	return {
		entitySchemaName: "InfBroadcast",
		attributes: {
			"IsEditable": {
				dataValueType: Terrasoft.DataValueType.BOOLEAN,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: true
			}
		},
		mixins: {
			ConfigurationGridUtilities: "Terrasoft.ConfigurationGridUtilities"
		},
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "DataGrid",
				"values": {
					"className": "Terrasoft.ConfigurationGrid",
					"generator": "ConfigurationGridGenerator.generatePartial",
					"generateControlsConfig": {"bindTo": "generateActiveRowControlsConfig"},
					"changeRow": {"bindTo": "changeRow"},
					"unSelectRow": {"bindTo": "unSelectRow"},
					"onGridClick": {"bindTo": "onGridClick"},
					"activeRowActions": [
						{
						    "className": "Terrasoft.Button",
						    "style": this.Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
						    "tag": "save",
						    "markerValue": "save",
						    "imageConfig": {"bindTo": "Resources.Images.SaveIcon"}
						},
						{
							className: "Terrasoft.Button",
							imageConfig: {bindTo: "Resources.Images.CardIcon"},
							markerValue: "card",
							style: Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
							tag: "card"
						},
						{
						    "className": "Terrasoft.Button",
						    "style": this.Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
						    "tag": "cancel",
						    "markerValue": "cancel",
						    "imageConfig": {"bindTo": "Resources.Images.CancelIcon"}
						},
						{
						    "className": "Terrasoft.Button",
						    "style": this.Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
						    "tag": "remove",
						    "markerValue": "remove",
						    "imageConfig": {"bindTo": "Resources.Images.RemoveIcon"}
						}
				    ],
				    "initActiveRowKeyMap": {"bindTo": "initActiveRowKeyMap"},
				    "activeRowAction": {"bindTo": "onActiveRowAction"},
				    "multiSelect": {"bindTo": "MultiSelect"}
				}
				}
			]/**SCHEMA_DIFF*/,
		methods: {
			getSwitchGridModeMenuItem: Terrasoft.emptyFn,
			onActiveRowAction: function(buttonTag, primaryColumnValue) {
					switch (buttonTag) {
						case "card":
							var row = this.getGridData().get(primaryColumnValue);
							this.saveRowChanges(row, function(p) {
								this.editRecord(row);
							}, this);
							break;
						case "remove":
							this.deleteRecords();
							break;
						case "cancel":
							this.discardChanges(primaryColumnValue);
							break;
						case "save":
							this.onActiveRowSave(primaryColumnValue);
							break;
					}
				},
			openCardByMode: function() {
					var cardState = this.get("CardState");
					var editPageUId = this.get("EditPageUId");
					var primaryValueUId = this.get("PrimaryValueUId");
					this.openCard(cardState, editPageUId, primaryValueUId);
				}
		}
	};
});









