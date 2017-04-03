module.exports = Model;


function Model(aModel, props) {
    if(Model.isAModel(aModel)) {
        throw "IS A MODEL";
    }

    aModel.$isModel = m.prop(true);
    aModel.props    = m.stream(props);
} 

Model.isAModel(aModel) = function() {
    if('$isModel' in aModel) {
        if(_.isFunction(aModel) && aModel.$isModel() == true) {
            return true;
        }
    }
    return false;
}

Model.undef = function () { return undefined };

Model.initialize = function (aConstructor, model, data) {
    if(!data) data = {};
    
    aConstructor.props().forEach(function (definition) {
        var val = data[definition.name];
        var stream = model[definition.name] = m.stream();
        
        //Si hay función de extracción la utilizo
        if(_.isFunction(definition.extract)) {
            val = definition.extract(val,data, model);
        }
        
        //Si no está el valor utilizo la funcion defaults o el valor defaults
        if(typeof val == 'undefined') {
            if(_.isFunction(definition.defaults)) {
                val = definition.defaults();
            }
            else {
                val = definition.defaults;
            }
        }
        
        //Cuando despues de todo hay un valor lo asigno
        if(typeof val != 'undefined') { 
            stream(val); 
        }
        
        //Se configuran los jsons
        if(definition.json === false) {
            stream.toJSON = Model.unef;
        } else if(nh.isFunction(definition.json)){
            stream.toJSON = definition.json;
        }
    });
}

