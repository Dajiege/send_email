var MongoClient = require('mongodb').MongoClient;
var config = require("../config/config");
var DB_CONN_STR = config.MONGODB_STR;
var insertData = function(data, conllection, db, callback){
  var collection = db.collection(conllection);
  collection.insert(data, function(err,result){
    if(err){
      console.log('Error:'+ err);
      return;
    }
    callback(result);
  });
};
var pushData = function(data, where, conllection, db, callback){
  var collection = db.collection(conllection);
  collection.update(where,{$push:data},function(err,result){
    if(err){
      console.log('Error:'+ err);
      return;
    }
    callback(result);
  });
};
var pullData = function(index, arr, where, conllection, db, callback){
  var collection = db.collection(conllection),
      pos = arr+'.'+index,
      data = {},
      data_ = {};
      data[pos] = {"delete":true};
      data_[arr] = {"delete":true}
      console.log(data_);
  collection.update(where,{$set: data},function(err,result){
    if(err){
      console.log('Error:'+ err);
      return;
    }
    callback(result);
  });
  collection.update(where,{$pull: data_},function(err,result){
    if(err){
      console.log('Error:'+ err);
      return;
    }
    callback(result);
  })
};
var updateData = function(data, where, conllection, db, callback){
  var collection = db.collection(conllection);
  collection.update(where,{$set: data},function(err,result){
    if(err){
      console.log('Error:'+ err);
      return;
    }
    callback(result);
  })
};
var selectData = function(where,conllection,select,db,callback){
  var collection = db.collection(conllection);
  collection.find(where,select).toArray(function(err,result){
    //console.log(result);
    if(err){
      console.log('Error:'+ err);
      return;
    }
    callback(result);
  });
};
var removeData = function(data,conllection,db,callback){
  var collection = db.collection(conllection);
  collection.remove(data,function(err,result){
    //console.log(result);
    if(err){
      console.log('Error:'+ err);
      return;
    }
    callback(result);
  });
};
var addIds = function(collection1,collection2,db,callback){
  var collection2 = db.collection(collection2);
  collection2.findAndModify({"_id": collection1},{},{$inc:{id: 1}},function(err,result){
    if(err){
      console.log('Error:'+ err);
      return;
    }
    callback(result.value.id);
  });
};
module.exports ={
  insertData:function(data,conllection,cb){
    MongoClient.connect(DB_CONN_STR, function(err,db){
      //console.log("连接成功!");
      insertData(data,conllection,db,function(result){
        if(cb){
          cb(result);
        }
        db.close();
      });
    });
  },
  selectData:function(where,conllection,select,cb){
    MongoClient.connect(DB_CONN_STR,function(err,db){
      //console.log("连接成功!");
      selectData(where,conllection,select,db,function(result){
        if(cb){
          cb(result);
        }
        db.close();
      })
    })
  },
  removeData:function(data,conllection,cb){
    MongoClient.connect(DB_CONN_STR, function(err,db){
      //console.log("连接成功!");
      removeData(data,conllection,db,function(result){
        if(cb){
          cb(result);
        }
        db.close();
      });
    });
  },
  addIds: function(collection1,collection2,cb){
     MongoClient.connect(DB_CONN_STR, function(err,db){
      //console.log("连接成功!");
      addIds(collection1,collection2,db,function(result){
        if(cb){
          cb(result);
        }
        db.close();
      })
  });
  },
  pushData: function(data,where,conllection,cb){
    MongoClient.connect(DB_CONN_STR, function(err,db){
      pushData(data,where,conllection,db,function(result){
        if(cb){
          cb(result);
        }
        db.close();
      })
    });
  },
  pullData: function(arr,index,where,conllection,cb){
     MongoClient.connect(DB_CONN_STR, function(err,db){
        pullData(index, arr, where, conllection, db, function(result){
          if(cb){
            cb(result);
          }
          db.close();
        })
     })
  },
  updateData: function(data,where,conllection,cb){
    MongoClient.connect(DB_CONN_STR, function(err,db){
      updateData(data,where,conllection,db,function(result){
        if(cb){
          cb(result);
        }
        db.close();
      })
    })
  }

}