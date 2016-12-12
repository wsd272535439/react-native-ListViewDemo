/**
 * Created by hwh on 16/7/4.
 */
import{
    AppRegistry,
    Text,
    View,
    TouchableOpacity,
    Image,
    PropTypes,
    NativeModules
} from 'react-native';
import  React, {Component} from 'react';

import Dimensions from 'Dimensions'
var width = Dimensions.get('window').width
var height = Dimensions.get('window').height
var Strftime = require('./DateFormat');
export default class extends Component{
    _formatDate(time){
        var _date = new Date(time*1000);
        var rtime = Strftime.strftime(_date,"%m-%d %H:%I" );

        var nowTime = new Date().getTime()/1000;

        time = nowTime - time;
        var str = rtime;
        if (time < 60) {
            str = '刚刚';
        } else if (time < 60 * 60) {
            min = Math.ceil( time / 60 );
            str = min + '分钟前';
        } else if (time < 60 * 60 * 24) {
            h = Math.ceil( time / (60 * 60) );
            str = h + '小时前 ' ;
        } else if (time < 60 * 60 * 24 * 30) {
            d = Math.ceil(time / (60 * 60 * 24));
            str = d + '天前 ';
        } else if (time < 60 * 60 * 24 * 30 * 12) {
            m = Math.ceil(time / (60 * 60 * 24 * 30 ));
            str = m + '月前 ';
        } else if (time < 60 * 60 * 24 * 30 * 12 * 5) {
            m = Math.ceil(time / (60 * 60 * 24 * 30  * 12));
            str = m + '年前 ';
        }else {
            // $str = $rtime;
        }
        return str;
    }
    render(){
        const {rowData} = this.props

        if(rowData){
            return(
                    <View style={{marginLeft:15,marginTop:15,marginBottom:15}}>
                        <Text>{rowData.question_content}</Text>
                        <View style={{marginTop:12,flexDirection:'row',width:width-30,alignItems:'center'}}>
                            <Image style={{width:15,height:15,borderRadius:7.5}}/>
                            <Text style={{marginLeft:8,color:'#999999',fontSize:12}}>{this._formatDate(rowData.add_time)}</Text>
                            <View style={{flexDirection:'row',position:'absolute',right:15}}>
                                <Image style={{height:13,width:15}} source={{uri:'http://static.baichebao.com/img/weixin/icon_answers.png'}}></Image>
                                <Text style={{fontSize:10,color:'#b3b3b3',marginLeft:2}}>{rowData.answer_users}</Text>
                                <Image style={{height:13,width:15,marginLeft:8}} source={{uri:'http://static.baichebao.com/img/weixin/icon_comment.png'}}></Image>
                                <Text style={{fontSize:10,color:'#b3b3b3',marginLeft:2}}>{rowData.all_answer_count}</Text>
                            </View>
                        </View>
                    </View>
            )
        }else{
            return false
        }
    }
}
