/**
 * Created by hwh on 16/5/30.
 */
import{
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    PropTypes,
    Navigator,
    ScrollView,
    NativeModules,
    TextInput,
    ListView,
    Image
} from 'react-native';
import  React, {Component} from 'react';
import Dimensions from 'Dimensions'
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height

String.prototype.trim = function(){
    return this.replace(/^[\s,，]+/, "").replace(/[\s,，]+$/, "");
}

export default class ConcernCell extends Component{

    _memCombineStr(str,separator){
        if(str){
            str = str.trim();
            let strArr = str.split(separator)
            console.log('splitStr',str,strArr)
            var targetArr = ''
            var index = 0
            for (var item of strArr){
                if (!(index == strArr.length - 1)){
                    targetArr += item + '、'
                }else{
                    targetArr += item
                }
                index ++
            }
            return targetArr
        }
    }

    render(){
        const {rowData,rowid} = this.props
        return(
            <TouchableWithoutFeedback onPress={()=>{
                TMReactBridgeManager.toNewMechine(rowData.uid)
            }}>
            <View>
                <View style={{flexDirection:'row',marginTop:15,marginBottom:15,alignItems:'center',backgroundColor:'white'}}>
                    <View>
                        <Image style={{marginLeft:15,width:50,height:50,borderRadius:25,alignSelf:'center',borderWidth:0.5,borderColor:"rgba(0,0,0,0.1)"}} source={{uri:rowData.avatar_file}}/>
                    </View>
                    <View style={{marginLeft:10,width:width/2}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{marginTop:2,fontSize:15,color:'#333333'}}>{rowData.user_name}</Text>
                            <Text style={{marginLeft:4,marginTop:3,fontSize:12,color:rowData.qcds_title.color,borderWidth:0.5,borderColor:rowData.qcds_title.color,borderRadius:1,padding:1}}>{" " + rowData.qcds_title.text + " "}</Text>
                        </View>

                        <Text style={{marginTop:6,fontSize:12,color:'#999999'}}>{"擅长：" + this._memCombineStr(rowData.mem,',')}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => this._concern(rowData.has_follow,rowData.uid,rowid)}>
                        {this._chageButton(rowData.has_follow)}
                    </TouchableWithoutFeedback>

                </View>
                <View style={{marginLeft:75,width:width-15,height:0.5,backgroundColor:'#e8e8e8'}}/>
            </View>
            </TouchableWithoutFeedback>
        )
    }

    _chageButton(has_follow){
        if (this.props.isSubmit){
            return (
                <View style={{position:'absolute',top:12,right:15,paddingLeft:15,paddingTop:5,paddingRight:15,paddingBottom:5,borderRadius:2,borderColor:'#ff4000',borderWidth:1,alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                    <Text style={{fontSize:14,color:'#ff4000'}}>咨询</Text>
                </View>
            )
        }
        if (has_follow && has_follow === 1){
            return (
                <View style={{position:'absolute',top:12,right:15,width:70,borderColor:'#cccccc',borderWidth:0.5,borderRadius:3,alignSelf:'center',padding:8,flexDirection:'row',justifyContent:'center'}}>
                    <Text style={{fontSize:12,color:'#999999'}}>取消关注</Text>
                </View>
            )
        }else{
            return (
                <View style={{position:'absolute',top:12,right:15,width:70,borderColor:'#cccccc',borderWidth:0.5,borderRadius:3,alignItems:'center',padding:8,flexDirection:'row',justifyContent:'center'}}>
                    <Image style={{width:13,height:13,marginRight:8}} source={require('./styles/assets/add.png')}/>
                    <Text style={{fontSize:12,color:'#666666'}}>关注</Text>
                </View>
            )
        }
    }
}
