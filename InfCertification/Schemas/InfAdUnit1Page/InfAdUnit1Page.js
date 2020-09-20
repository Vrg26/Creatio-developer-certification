define("InfAdUnit1Page", ["ProcessModuleUtilities"], function(ProcessModuleUtilities) {
	return {
		entitySchemaName: "InfAdUnit",
		attributes: {},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "InfAdUnitFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "InfAdUnit"
				}
			},
			"InfBroadcastDetail668d6789": {
				"schemaName": "InfBroadcastDetail",
				"entitySchemaName": "InfBroadcast",
				"filter": {
					"detailColumn": "InfAdUnit",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"InfOwner": {
				"1005252d-92a2-47a4-bb82-7ba7fd570aa4": {
					"uId": "1005252d-92a2-47a4-bb82-7ba7fd570aa4",
					"enabled": true,
					"removed": false,
					"ruleType": 1,
					"baseAttributePatch": "Type",
					"comparisonType": 3,
					"autoClean": false,
					"autocomplete": false,
					"type": 0,
					"value": "60733efc-f36b-1410-a883-16d83cab0980",
					"dataValueType": 10
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
		messages:{
			"CreatedBroadcast":{
				mode: Terrasoft.MessageMode.BROADCAST,
                direction: Terrasoft.MessageDirectionType.SUBSCRIBE
			},
		},
		methods: {
			
			init: function(){
				this.callParent(arguments);
				this.sandbox.subscribe("CreatedBroadcast", this.updateDetailBroadcast, this, ["CreatedBroadcast"]);
			},
			updateDetailBroadcast: function(){
				this.updateDetail({detail: "InfBroadcastDetail668d6789"});
			},
			getActions:function(){
				const actionItems=this.callParent(arguments);
				actionItems.addItem(this.getButtonMenuItem({
						"Caption":  {bindTo: "Resources.Strings.CreateBroadcast"},
						"Click": {bindTo: "runCreateBroadcast"},
					}));
				return actionItems;
			},
			
			runCreateBroadcast: function(){
				const adUnitId = this.get("Id");
				const args = {
					sysProcessName: "InfProcessAutoCreationBroadcastRecords",
					parameters:{
	        			AdUnit: adUnitId
	        		}
				};
				ProcessModuleUtilities.executeProcess(args);
			},
			
			asyncValidate: function(callback, scope){
			this.callParent([function(response) {
				if (!this.validateResponse(response)) {
					return;
				}
			Terrasoft.chain(
				function(next) {
					this.validateHourlyAdBlocks(function(response) {
						if (this.validateResponse(response)) {
							next();
						}
					}, this);
				},
				function(next) {
					callback.call(scope, response);
					next();
				}, this);
		}, this]);
			},
			
			validateHourlyAdBlocks: function(callback, scope){
				const result = { success: true };
				const adUnit = this;
				const periodHourlyId = "75B8E218-1788-46A6-8FA8-591420B4E540".toLowerCase();
				
				if(!this.get("InfActive")){
					callback.call(scope || this, result);
					return;
				}
				if(this.get("InfPeriodicityAdUnit").value !== periodHourlyId){
					callback.call(scope || this, result);
					return;
				}
				Terrasoft.SysSettings.querySysSettingsItem("InfMaxNumberActiveHourlyBroadcasts", function(maxCount) {
					var esq = adUnit.Ext.create("Terrasoft.EntitySchemaQuery", {
					    rootSchemaName: "InfAdUnit"
					});
					const esqNotThisFilter = esq.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.NOT_EQUAL, "Id", adUnit.get("Id"));
					const esqActiveFilter = esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "InfActive", true);
					const esqPeriodFilter = esq.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "InfPeriodicityAdUnit.Id", periodHourlyId);
					
					esq.filters.logicalOperation = Terrasoft.LogicalOperatorType.AND;
					
					esq.filters.add("esqActiveFilter", esqActiveFilter);
					esq.filters.add("esqPeriodFilter", esqPeriodFilter);
					esq.filters.add("esqNotThisFilter", esqNotThisFilter);
					
					esq.getEntityCollection(function(response){
						const countAdUnit = response.collection.getCount() + 1;
						
						if(countAdUnit > maxCount){
							result.success = false;
							result.message = adUnit.get("Resources.Strings.MaxNumberActiveHourlyBroadcasts") + maxCount;
						}
						callback.call(scope || adUnit, result);
					}, adUnit);
				});
			},
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "InfNamecc05771c-a735-4f6e-bd0c-9178d375d9b1",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "InfName"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "STRINGef6bd870-866d-4120-a903-178cc0955038",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "InfCode",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "LOOKUP76b0533b-a903-4f6e-8cc2-9a9271fd2812",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "InfOwner",
					"enabled": true,
					"contentType": 5
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "BOOLEANfcf162d6-b8ca-4b04-93ed-18988f2545ec",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "InfActive",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "LOOKUPc42d8f14-2190-48f9-bdc6-cb1a8578adba",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 4,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "InfPeriodicityAdUnit",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "STRING642e76bf-577f-4d71-af2e-4db17604b7b2",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 3,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "InfNote",
					"enabled": true,
					"contentType": 0
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Tab568a3efcTabLabel",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tab568a3efcTabLabelTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "InfBroadcastDetail668d6789",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "Tab568a3efcTabLabel",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesAndFilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
					},
					"items": [],
					"order": 1
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Files",
				"values": {
					"itemType": 2
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesControlGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.NotesGroupCaption"
					},
					"items": []
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Notes",
				"values": {
					"bindTo": "InfNotes",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24
					},
					"labelConfig": {
						"visible": false
					},
					"controlConfig": {
						"imageLoaded": {
							"bindTo": "insertImagesToNotes"
						},
						"images": {
							"bindTo": "NotesImagesCollection"
						}
					}
				},
				"parentName": "NotesControlGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 2
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
