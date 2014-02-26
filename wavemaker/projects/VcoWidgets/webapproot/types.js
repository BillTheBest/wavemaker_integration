wm.types = {
	"types": {
		"boolean": {
			"internal": true,
			"primitiveType": "Boolean"
		},
		"byte": {
			"internal": true,
			"primitiveType": "Number"
		},
		"char": {
			"internal": true,
			"primitiveType": "String"
		},
		"com.vmware.o11n.sdk.rest.client.stubs.AboutInfo": {
			"fields": {
				"apiVersion": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"buildDate": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"buildNumber": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"version": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "vCOGeneralService"
		},
		"com.vmware.o11n.sdk.rest.client.stubs.Parameter": {
			"fields": {
				"array": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.sdk.rest.client.stubs.Array"
				},
				"composite": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.sdk.rest.client.stubs.Composite"
				},
				"date": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "javax.xml.datatype.XMLGregorianCalendar"
				},
				"description": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"mimeAttachment": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.sdk.rest.client.stubs.MimeAttachment"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 5,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"number": {
					"exclude": [],
					"fieldOrder": 6,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Double"
				},
				"properties": {
					"exclude": [],
					"fieldOrder": 7,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.sdk.rest.client.stubs.Properties"
				},
				"scope": {
					"exclude": [],
					"fieldOrder": 8,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.sdk.rest.client.stubs.Scope"
				},
				"sdkObject": {
					"exclude": [],
					"fieldOrder": 9,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.sdk.rest.client.stubs.SdkObject"
				},
				"secureString": {
					"exclude": [],
					"fieldOrder": 10,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.sdk.rest.client.stubs.SecureString"
				},
				"string": {
					"exclude": [],
					"fieldOrder": 11,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"type": {
					"exclude": [],
					"fieldOrder": 12,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WorkflowService"
		},
		"com.vmware.o11n.sdk.rest.client.stubs.User": {
			"fields": {
				"adminRights": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "boolean"
				},
				"solutionUser": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "vCOGeneralService"
		},
		"com.vmware.o11n.wm.common.BaseParameter": {
			"fields": {
				"description": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"type": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WorkflowService"
		},
		"com.vmware.o11n.wm.common.ExecutionParameter": {
			"fields": {
				"displayValue": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Object"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"paramType": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"type": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Object"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WorkflowService"
		},
		"com.vmware.o11n.wm.common.FilterType": {
			"fields": {
				"displayValue": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Object"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WorkflowService"
		},
		"com.vmware.o11n.wm.common.PaginatedUserInteractions": {
			"fields": {
				"list": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.UserInteractionModel"
				},
				"start": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "int"
				},
				"total": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "int"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WorkflowService"
		},
		"com.vmware.o11n.wm.common.PaginatedWorkflowExecutions": {
			"fields": {
				"list": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.WorkflowExecutionModel"
				},
				"start": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "int"
				},
				"total": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "int"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WorkflowService"
		},
		"com.vmware.o11n.wm.common.PaginatedWorkflows": {
			"fields": {
				"list": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.WorkflowModel"
				},
				"start": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "int"
				},
				"total": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "int"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WorkflowService"
		},
		"com.vmware.o11n.wm.common.PresentationParameter": {
			"fields": {
				"name": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"type": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Object"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "PresentationService"
		},
		"com.vmware.o11n.wm.common.QuerySpec": {
			"fields": {
				"conditions": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"keys": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"maxResult": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "int"
				},
				"queryCount": {
					"exclude": [],
					"fieldOrder": 5,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "boolean"
				},
				"search": {
					"exclude": [],
					"fieldOrder": 6,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sortOrders": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"startIndex": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "int"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WorkflowService"
		},
		"com.vmware.o11n.wm.presentation.dao.CatalogModel": {
			"fields": {
				"catalogPages": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.CatalogPage"
				},
				"categories": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.CategoryModel"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "CatalogService"
		},
		"com.vmware.o11n.wm.presentation.dao.CatalogPage": {
			"fields": {
				"catalogItems": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.WorkflowModel"
				},
				"category": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.CategoryModel"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "CatalogService"
		},
		"com.vmware.o11n.wm.presentation.dao.CategoryModel": {
			"fields": {
				"id": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"order": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "int"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "CatalogService"
		},
		"com.vmware.o11n.wm.presentation.dao.ExecutionStateModel": {
			"fields": {
				"executionId": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"state": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"workflowId": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WorkflowService"
		},
		"com.vmware.o11n.wm.presentation.dao.FieldModel": {
			"fields": {
				"constraints": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.ConstraintsModel"
				},
				"decorators": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.DecoratorsModel"
				},
				"displayName": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"fieldType": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.FieldModel.FieldTypeModel"
				},
				"hidden": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"id": {
					"exclude": [],
					"fieldOrder": 5,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"messages": {
					"exclude": [],
					"fieldOrder": 6,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.MessageModel"
				},
				"type": {
					"exclude": [],
					"fieldOrder": 7,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"valid": {
					"exclude": [],
					"fieldOrder": 8,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"value": {
					"exclude": [],
					"fieldOrder": 9,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Object"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "PresentationService"
		},
		"com.vmware.o11n.wm.presentation.dao.GroupModel": {
			"fields": {
				"description": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"displayName": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"fields": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.FieldModel"
				},
				"hidden": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"messages": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.MessageModel"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "PresentationService"
		},
		"com.vmware.o11n.wm.presentation.dao.InventoryObjectModel": {
			"fields": {
				"data": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"href": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"type": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "CatalogService"
		},
		"com.vmware.o11n.wm.presentation.dao.PresentationModel": {
			"fields": {
				"associatedExecutionId": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"description": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"id": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"steps": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.StepModel"
				},
				"valid": {
					"exclude": [],
					"fieldOrder": 5,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "PresentationService"
		},
		"com.vmware.o11n.wm.presentation.dao.StepModel": {
			"fields": {
				"description": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"displayName": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"groups": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.GroupModel"
				},
				"hidden": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"messages": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.presentation.dao.MessageModel"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "PresentationService"
		},
		"com.vmware.o11n.wm.presentation.dao.UserInteractionModel": {
			"fields": {
				"createDate": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.util.Date"
				},
				"description": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"executionId": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"id": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"workflowId": {
					"exclude": [],
					"fieldOrder": 5,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WorkflowService"
		},
		"com.vmware.o11n.wm.presentation.dao.WorkflowExecutionModel": {
			"fields": {
				"businessState": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"contentException": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"endDate": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.util.Date"
				},
				"id": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"inputParameters": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.common.ExecutionParameter"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 5,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"outputParameters": {
					"exclude": [],
					"fieldOrder": 6,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.common.ExecutionParameter"
				},
				"parameters": {
					"exclude": [],
					"fieldOrder": 7,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.common.ExecutionParameter"
				},
				"startDate": {
					"exclude": [],
					"fieldOrder": 8,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.util.Date"
				},
				"startedBy": {
					"exclude": [],
					"fieldOrder": 9,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"state": {
					"exclude": [],
					"fieldOrder": 10,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"type": {
					"exclude": [],
					"fieldOrder": 11,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WorkflowService"
		},
		"com.vmware.o11n.wm.presentation.dao.WorkflowModel": {
			"fields": {
				"canEdit": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "boolean"
				},
				"canExecute": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "boolean"
				},
				"categoryName": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"customizedIconExists": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "boolean"
				},
				"description": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"iconHref": {
					"exclude": [],
					"fieldOrder": 5,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"id": {
					"exclude": [],
					"fieldOrder": 6,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"inputParameters": {
					"exclude": [],
					"fieldOrder": 7,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.common.BaseParameter"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 8,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"outputParameters": {
					"exclude": [],
					"fieldOrder": 9,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.vmware.o11n.wm.common.BaseParameter"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WorkflowService"
		},
		"com.vmware.o11n.wm.presentation.dao.WorkflowRunEvent": {
			"fields": {
				"date": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.util.Date"
				},
				"description": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"displayName": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"severity": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"user": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WorkflowService"
		},
		"double": {
			"internal": true,
			"primitiveType": "Number"
		},
		"float": {
			"internal": true,
			"primitiveType": "Number"
		},
		"int": {
			"internal": true,
			"primitiveType": "Number"
		},
		"java.lang.Boolean": {
			"internal": false,
			"primitiveType": "Boolean"
		},
		"java.lang.Byte": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.lang.Character": {
			"internal": false,
			"primitiveType": "String"
		},
		"java.lang.Double": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.lang.Float": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.lang.Integer": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.lang.Long": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.lang.Short": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.lang.String": {
			"internal": false,
			"primitiveType": "String"
		},
		"java.lang.StringBuffer": {
			"internal": false,
			"primitiveType": "String"
		},
		"java.math.BigDecimal": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.math.BigInteger": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.sql.Date": {
			"internal": false,
			"primitiveType": "Date"
		},
		"java.sql.Time": {
			"internal": false,
			"primitiveType": "Date"
		},
		"java.sql.Timestamp": {
			"internal": false,
			"primitiveType": "Date"
		},
		"java.util.Date": {
			"internal": false,
			"primitiveType": "Date"
		},
		"long": {
			"internal": true,
			"primitiveType": "Number"
		},
		"short": {
			"internal": true,
			"primitiveType": "Number"
		}
	}
};