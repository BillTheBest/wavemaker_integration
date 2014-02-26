package com.vmware.o11n.wm.mapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.vmware.o11n.sdk.rest.client.stubs.Array;
import com.vmware.o11n.sdk.rest.client.stubs.BaseDecorator;
import com.vmware.o11n.sdk.rest.client.stubs.ChooserDecorator;
import com.vmware.o11n.sdk.rest.client.stubs.DropDownDecorator;
import com.vmware.o11n.sdk.rest.client.stubs.Field;
import com.vmware.o11n.sdk.rest.client.stubs.Mandatory;
import com.vmware.o11n.sdk.rest.client.stubs.MultilineDecorator;
import com.vmware.o11n.sdk.rest.client.stubs.NumberFormat;
import com.vmware.o11n.sdk.rest.client.stubs.RangeConstraint;
import com.vmware.o11n.sdk.rest.client.stubs.RefreshOnChangeDecorator;
import com.vmware.o11n.sdk.rest.client.stubs.RegExp;
import com.vmware.o11n.sdk.rest.client.stubs.RestrictDuplicatesConstraint;
import com.vmware.o11n.sdk.rest.client.stubs.SdkObject;
import com.vmware.o11n.wm.presentation.dao.ConstraintsModel;
import com.vmware.o11n.wm.presentation.dao.DecoratorsModel;
import com.vmware.o11n.wm.presentation.dao.VcoObject;
import org.apache.commons.lang.StringUtils;

import com.vmware.o11n.sdk.rest.client.stubs.AbstractPresentationContent.Steps;
import com.vmware.o11n.sdk.rest.client.stubs.ElementMessage;
import com.vmware.o11n.sdk.rest.client.stubs.Group;
import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.Presentation;
import com.vmware.o11n.sdk.rest.client.stubs.PresentationElement;
import com.vmware.o11n.sdk.rest.client.stubs.PresentationExecution;
import com.vmware.o11n.sdk.rest.client.stubs.PresentationExecution.OutputParameters;
import com.vmware.o11n.sdk.rest.client.stubs.PrimaryField;
import com.vmware.o11n.sdk.rest.client.stubs.Step;
import com.vmware.o11n.wm.common.BaseParameter;
import com.vmware.o11n.wm.common.ExecutionParameter;
import com.vmware.o11n.wm.presentation.dao.FieldModel;
import com.vmware.o11n.wm.presentation.dao.GroupModel;
import com.vmware.o11n.wm.presentation.dao.MessageModel;
import com.vmware.o11n.wm.presentation.dao.PresentationModel;
import com.vmware.o11n.wm.presentation.dao.StepModel;

import javax.xml.datatype.XMLGregorianCalendar;

public class PresentationModelMapper {
    private static final Set<String> SIMPLE_TYPES_ARRAY = new HashSet<String>();
    static {
    	SIMPLE_TYPES_ARRAY.add("RgExp".toLowerCase());
    	SIMPLE_TYPES_ARRAY.add("Text".toLowerCase());
    	SIMPLE_TYPES_ARRAY.add(BaseParameter.DATE_TYPE.toLowerCase());
    	SIMPLE_TYPES_ARRAY.add(BaseParameter.BOOLEAN_TYPE.toLowerCase());
    	SIMPLE_TYPES_ARRAY.add(BaseParameter.STRING_TYPE.toLowerCase());
    	SIMPLE_TYPES_ARRAY.add(BaseParameter.NUMBER_TYPE.toLowerCase());
    	SIMPLE_TYPES_ARRAY.add(BaseParameter.SECURE_STRING_TYPE.toLowerCase());
    	SIMPLE_TYPES_ARRAY.add(BaseParameter.PATH_TYPE.toLowerCase());
        SIMPLE_TYPES_ARRAY.add(BaseParameter.MIME_TYPE.toLowerCase());
    }

    PresentationModel model;
    Map<String, ExecutionParameter> outputParams;
    
    public PresentationModelMapper(Presentation presentation) {
    	map(presentation);
    }
    
    public PresentationModelMapper(PresentationExecution presentationExecution) {
    	map(presentationExecution);
    }

	public PresentationModel getPresentationModel() {
		return model;
	}

	private void map(Presentation source) {
		model = new PresentationModel();
		model.setName(source.getName());
		model.setDescription(source.getDescription());
		model.setHref(source.getHref());
		mapSteps(source.getSteps());
	}

	private void map(PresentationExecution source) {
		model = new PresentationModel();
		model.setName(source.getName());
		model.setDescription(source.getDescription());
		model.setHref(source.getHref());
		iterateOverParams(source.getOutputParameters());
		mapSteps(source.getSteps());

		model.setId(source.getId());
		model.setValid(source.isValid());
	}

	private void iterateOverParams(OutputParameters outputParameters) {
		if(outputParameters == null 
				|| outputParameters.getParameter() == null
				|| outputParameters.getParameter().isEmpty()) 
			return;
		outputParams = new HashMap<String, ExecutionParameter>(outputParameters.getParameter().size());
		for (Parameter param : outputParameters.getParameter()) {
			ExecutionParameter exParam = new ExecutionParameter(param);
			outputParams.put(exParam.getName(), exParam);
		}
		
	}

	private void mapSteps(Steps sourceSteps) {
		if (sourceSteps == null || sourceSteps.getStep() == null || sourceSteps.getStep().isEmpty()) {
			model.setSteps(Collections.<StepModel> emptyList());
			return;
		}
		List<StepModel> steps = new ArrayList<StepModel>(sourceSteps.getStep().size());
		for (Step step : sourceSteps.getStep()) {
			steps.add(map(step));
		}
		model.setSteps(steps);
	}

    private StepModel map(Step source) {
        StepModel model = new StepModel();
        model.setDescription(source.getDescription());
        model.setDisplayName(source.getDisplayName());
        model.setHidden(source.isHidden());
        model.setMessages(getMessages(source.getMessages()));

        List<GroupModel> groupModels = new ArrayList<GroupModel>();
        for (PresentationElement element : source.getGroupOrField()) {
            if (element instanceof Group) {
                groupModels.add(map((Group) element));
            }
        }

        model.setGroups(groupModels);

        return model;
    }

    private MessageModel map(ElementMessage source) {
        MessageModel model = new MessageModel();
        model.setMessage(source.getSummary());
        model.setSeverity(source.getSeverity());
        return model;
    }

    private GroupModel map(Group source) {
        GroupModel model = new GroupModel();

        model.setHidden(source.isHidden());
        model.setDescription(source.getDescription());
        model.setDisplayName(source.getDisplayName());
        model.setMessages(getMessages(source.getMessages()));

        List<FieldModel> fieldModels = new ArrayList<FieldModel>();
        for (PrimaryField field : source.getFields().getField()) {
            fieldModels.add(map(field));
        }
        model.setFields(fieldModels);

        return model;
    }

    private FieldModel map(PrimaryField source) {
        FieldModel model = new FieldModel();
        model.setId(source.getId());
        model.setDisplayName(source.getDisplayName());
        model.setHidden(source.isHidden());
        model.setMessages(getMessages(source.getMessages()));
        model.setType(source.getType());
       
        if(outputParams != null) {
        	ExecutionParameter param = outputParams.get(source.getId());
        	if(param != null) {
        		model.setValue(param.getValue());
        	}
        }
        model.setConstraints(map(source.getConstraints(), model.getType()));
        model.setDecorators(map(source.getDecorators()));
//        model.value = getFieldValue(source);

        if (isPluginType(model.getType())) {
            model.setFieldType(FieldModel.FieldTypeModel.SDK_OBJECT);
        } else if (isSimpleType(model.getType())) {
            model.setFieldType(FieldModel.FieldTypeModel.SIMPLE);
        } else {
            model.setFieldType(FieldModel.FieldTypeModel.WORKFLOW);
        }

//        setDefaultChooserDecorator(model);

        return model;
    }

    private ConstraintsModel map(Field.Constraints source, String modelType) {
        ConstraintsModel model = new ConstraintsModel();

        if (source == null || source.getMandatoryOrRestrictDuplicatesOrRegexp() == null) {
            return model;
        }

        for (Object constraint : source.getMandatoryOrRestrictDuplicatesOrRegexp()) {
            if (constraint instanceof Mandatory) {
                model.setMandatory(true);
            } else if (constraint instanceof RegExp) {
                model.setRegExp(((RegExp) constraint).getExpression());
            } else if (constraint instanceof RangeConstraint) {
                model.setRange(model.new RangeModel());
                model.getRange().setMin(getRangeLimitValue(((RangeConstraint) constraint).getMin(), modelType));
                model.getRange().setMax(getRangeLimitValue(((RangeConstraint) constraint).getMax(), modelType));
            } else if (constraint instanceof RestrictDuplicatesConstraint) {
                model.setRestrictDuplicates(true);
            } else if (constraint instanceof NumberFormat) {
                model.setFormat(((NumberFormat)constraint).getValue());
            }
        }

        return model;
    }

    private DecoratorsModel map(Field.Decorators source) {
        DecoratorsModel model = new DecoratorsModel();
        if (source == null || source.getChooserOrRefreshOnChangeOrDropDown() == null) {
            return model;
        }
        for (BaseDecorator decorator : source.getChooserOrRefreshOnChangeOrDropDown()) {
            if (decorator instanceof ChooserDecorator) {
                ChooserDecorator chooserDecorator = (ChooserDecorator) decorator;

                // drop-down type, has hyphen and it is preferable to remove it here than in the Enum type
                if (chooserDecorator.getType().equals("drop-down")) {
                    chooserDecorator.setType("dropdown");
                }
                
                model.setChooserDecorator(DecoratorsModel.ChooserType.valueOf((chooserDecorator).getType().toUpperCase()));
                SdkObject sdkObject = chooserDecorator.getSdkObject();
                if (sdkObject == null) {
                    continue;
                }

//                InventoryObjectRef rootElementMor = new InventoryObjectRef();
//                rootElementMor.serverGuid = sdkObject.getHref();
//                rootElementMor.type = sdkObject.getType();
//                rootElementMor.value = sdkObject.getHref();
//                rootElementMor.setNamespace();
//
//                model.rootElements = Arrays.asList(rootElementMor);
            } else if (decorator instanceof RefreshOnChangeDecorator) {
                model.setRefreshOnChange(true);
            } else if (decorator instanceof DropDownDecorator) {
                Array elements = ((DropDownDecorator) decorator).getArray();

                if (elements == null) {
                    continue;
                }
                model.setPredefinedList(new ArrayList<Object>(elements.getSdkObjectOrStringOrSecureString().size()));

                for (Object element : elements.getSdkObjectOrStringOrSecureString()) {
                    if (element instanceof SdkObject) {
                        model.getPredefinedList().add(map((SdkObject) element));
                    } else {
                        if (element instanceof XMLGregorianCalendar) {
                            model.getPredefinedList().add(((XMLGregorianCalendar) element).toGregorianCalendar().getTime());
                        } else {
                            model.getPredefinedList().add(element);
                        }
                    }
                }
            } else if (decorator instanceof MultilineDecorator) {
                model.setMultiline(true);
            }
        }

        return model;
    }

    private VcoObject map(SdkObject source) {
        VcoObject model = new VcoObject();

        model.setHref(source.getHref());
        model.setType(source.getType());
        model.setId(source.getId());
        model.setDisplayValue(source.getDisplayValue());

        return model;
    }

    private List<MessageModel> getMessages(PresentationElement.Messages messages) {
        List<MessageModel> list = new ArrayList<MessageModel>();
        if (messages == null || messages.getMessage() == null) {
            return list;
        }

        for (ElementMessage message : messages.getMessage()) {
            list.add(map(message));
        }

        return list;
    }

//    private void setDefaultChooserDecorator(FieldModel model) {
//        DecoratorsModel.ChooserType defaultChooserType = null;
//        if (model.getFieldType() == FieldModel.FieldTypeModel.SDK_OBJECT) {
//            defaultChooserType = DecoratorsModel.ChooserType.TREE;
//            // Simple types does not have choosers at all.
//        } else if (model.getFieldType() != FieldModel.FieldTypeModel.SIMPLE) {
//            defaultChooserType = DecoratorsModel.ChooserType.LIST;
//        }
//
//        model.getDecorators().chooserDecorator = model.getDecorators().chooserDecorator == DecoratorsModel.ChooserType.NONE ? defaultChooserType
//                : model.getDecorators().chooserDecorator;
//    }

/*
    private Object getFieldValue(PrimaryField field) {
        if (field.getArray() != null) {
            List<Object> result = new ArrayList<Object>();
            for (Object obj : field.getArray().getSdkObjectOrStringOrSecureString()) {
                if (obj instanceof SdkObject) {
                    result.add(map((SdkObject) obj));
                } else if (obj instanceof XMLGregorianCalendar) {
                    result.add(((XMLGregorianCalendar) obj).toGregorianCalendar().getTime());
                } else {
                    result.add(obj);
                }
            }
            return result;
        }
        if (field.getDate() != null) {
            return field.getDate().toGregorianCalendar().getTime();
        }
        if (field.getMimeAttachment() != null) {
            return field.getMimeAttachment();
        }
        if (field.getNumber() != null) {
            return field.getNumber();
        }
        if (field.getSdkObject() != null) {
            return map(field.getSdkObject());
        }
        if (BaseParameter.BOOLEAN_TYPE.equalsIgnoreCase(field.getType())) {
            // TODO : temporary fix - rest service sends null values for booleans,
            // but does not accept them in return
            Boolean value = field.isBoolean();
            if (value == null) {
                value = Boolean.valueOf(false);
            }
            return value;
        }
        return field.getString();
    }
*/
    private Object getRangeLimitValue(String source, String modelType) {
        if (source == null) {
            return null;
        }

        if (BaseParameter.NUMBER_TYPE.equalsIgnoreCase(modelType)) {
            return new Double(source);
        } else if (BaseParameter.DATE_TYPE.equalsIgnoreCase(modelType)) {
            //TODO
//            return DateHelper.parseISODate(source);
        } else if (BaseParameter.STRING_TYPE.equalsIgnoreCase(modelType)) {
            // min and max length
            return new Double(source);
        }

        return null;
    }

    private boolean isPluginType(String type) {
    	if(StringUtils.isEmpty(type))
    		return false;
        int pluginDelimiterPosition = type.indexOf(":");
        return pluginDelimiterPosition > -1
                && !type.substring(0, pluginDelimiterPosition).equals("Enums");
    }

    private boolean isSimpleType(String type) {
        int arrayTypeIndex = type.indexOf(BaseParameter.ARRAY_TYPE_PREFIX);
        String noArray = arrayTypeIndex > -1 ? type.substring(arrayTypeIndex + 6).toLowerCase()
                                             : type.toLowerCase();
        
        return SIMPLE_TYPES_ARRAY.contains(noArray);
    }
}