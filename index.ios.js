/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import {
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
    Image,
    RefreshControl,
} from 'react-native';
import React, {Component} from 'react';

import Dimensions from 'Dimensions'
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import SimpleQuestionCell from './SimpleQuestionCell'
import ConcernCell from './ConcernCell'

String.prototype.trim = function(){
  return this.replace(/^[\s,，]+/, "").replace(/[\s,，]+$/, "");
}

export default class ListViewDemo extends Component {
  constructor(props){
    super(props)

    this.state = {
      text:"",
      loadMore:false,
      brand:props.brand,
      userData:{},
      ds:new ListView.DataSource(
          {
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
          }
      )
    }
  }

  componentDidMount(){
    console.log('simple',SimpleQuestionCell)
    this._fetchData()
  }

  async _fetchData(props){
    let response = await fetch('https://wangclub.herokuapp.com/getListViewData')
    let json = await response.json()
    console.log('json',json)
    if(json){
      this.setState({
        data:json
      })
    }
  }

  _memCombineStr(str,separator){
    str = str.trim();
    let strArr = str.split(separator)
    console.log('splitStr',str,strArr)
    var targetArr = ''
    for (var item of strArr){
      targetArr += '#' + item + '  '
    }
    return targetArr
  }

  _brandComShow(){
    let brandme = this.state.data.lists.brandme
    if(brandme && brandme[0] !== 'none'){
      return(
          <View style={{marginTop:15,flexDirection:'row',width:width}}>
            <Text style={{flex:1,marginLeft:15,fontSize:13,fontWeight:'bold',color:'#333333'}}>{this.state.brand?this.state.brand+'品牌技师':'暂无品牌技师'}</Text>
            <Text style={{flex:1,marginRight:4,fontSize:12,textAlign:'right',color:'#999999'}}>更多</Text>
            <Image style={{width:8,height:12,marginRight:12}} source={require('./styles/assets/icon_right@3x.png')}/>
          </View>
      )
    }else{
      return undefined
    }
  }

  _renderRowNew(rowData,sectionId,rowId){
    if(sectionId === 'question'){
      return (
          <Text>{rowData.question_content}</Text>
      )
    }

  }

  _renderRow(rowData,sectionID,rowId){
    if (sectionID === 'question'){
      if(rowData === 'ask'){
        return(
            <View>
              <View style={{backgroundColor:'white',padding:15,width:width}}>
                <View style={{backgroundColor:'#ff4b0c',borderRadius:4,flexDirection:'row',height:42,alignItems:'center',justifyContent:'center'}}>
                  <Image source={require('./styles/assets/lijitiwen.png')} style={{width:16,height:16}}/>
                  <Text style={{marginLeft:4,color:'white',fontSize:15}}>立即提问</Text>
                </View>
              </View>
              <View style={{height:5,backgroundColor:"#f2f2f2",width:width}}/>
            </View>
        )
      }
      return (
          <View>
            <SimpleQuestionCell rowData={rowData} />
            {this._renderFooter(sectionID,rowId)}
          </View>
      )
    }

    if(sectionID === 'article'){
      console.log('articleImg',rowData.pic)
      return (
            <View>
              <View style={{flexDirection:'row',marginTop:15,marginBottom:15,backgroundColor:'white'}}>
                <View>
                  <Image style={{marginLeft:15,width:100,height:75,alignSelf:'center'}} source={{uri:rowData.pic}}/>
                </View>
                <View style={{marginLeft:10,width:width/2 + 25}}>
                  <Text style={{marginTop:5,fontSize:15,color:'#333333'}}>{rowData.title}</Text>
                  <View style={{position:'absolute',top:65,flexDirection:'row'}}>
                    <Text style={{fontSize:10,color:'#999999'}}>{rowData.publish_at_friendly}</Text>
                  </View>
                  <Image source={require('./styles/assets/ribaopinlun.png')} style={{position:'absolute',top:67,width:12,height:12,right:15}}/>
                  <Text style={{position:'absolute',top:66,fontSize:10,color:'#999999',right:2}}>{rowData.comment_count}</Text>
                </View>
              </View>
              {this._renderFooter(sectionID,rowId)}
            </View>
      )
    }

    if(sectionID === 'service'){
      return (
            <View>
              <View style={{flexDirection:'row',marginTop:15,marginBottom:15,alignItems:'center',backgroundColor:'white'}}>
                <View>
                  <Image style={{marginLeft:15,width:60,height:60,alignSelf:'center'}} source={{uri:rowData.icon}}/>
                </View>
                <View style={{marginLeft:10,width:width/2}}>
                  <Text style={{marginTop:5,fontSize:13,color:'#333333'}}>{rowData.name}</Text>
                  <Text style={{marginTop:6,fontSize:10,color:'#999999'}}>{rowData.description}</Text>
                  <Text style={{marginTop:6,fontSize:13,color:'#ff4b0c'}}>{'￥' + rowData.price}<Text style={{fontSize:10,color:'#999999',textDecorationLine:'line-through'}}>{'￥' + rowData.market_price}</Text></Text>
                </View>
              </View>
              {this._renderFooter(sectionID,rowId)}
            </View>
      )
    }
    //
    if (sectionID === 'brandme'){
      if (rowData == 'none' && !this.props.brand){
        return(<NoBrandView/>)
      }else if(rowData == 'none' && this.props.brand && this.props.brand !== ''){
        return (
            <View style={{justifyContent:'center',alignItems:'center',width:width,height:height - 256}}>
              <Image style={{width:80,height:80}}source={require('./styles/assets/pic_jishi.png')}/>
              <Text style={{fontSize:14,color:'#999999'}}>没有技师</Text>
            </View>
        )
      }
      return(
          <View>
            <ConcernCell rowData={rowData} rowid={rowId} isSubmit={true}/>
            {this._renderFooter(sectionID,rowId)}
          </View>
      )
    }
    return <View/>
  }

  _checkHeadText(sectionId){
    if (sectionId === 'service'){
      return '服务'
    }else if(sectionId === 'brandme'){
      return '技师'
    }else if (sectionId === 'question'){
      return '问题'
    }else if(sectionId === 'article'){
      return '资讯'
    }
  }

  _getHeaderImg(sectionId){
    if (sectionId === 'service'){
      return require('./styles/assets/fuwu.png')
    }else if(sectionId === 'brandme'){
      return require('./styles/assets/jishi.png')
    }else if (sectionId === 'question'){
      return require('./styles/assets/wenti.png')
    }else if(sectionId === 'article'){
      return require('./styles/assets/article.png')
    }
  }

  _headerLine(sectionId){
    if(sectionId === 'question'){
      return(
          <View style={{marginTop:10,marginLeft:15,width:width-15,height:0.5,backgroundColor:'#e8e8e8'}}/>
      )
    }else{
      return false
    }
  }
  _renderHeader(sectionData,sectionId){
    if(sectionData && sectionId){
      if(sectionId === 'question'){
        if(sectionData[0] === 'ask'){
          return false
        }
      }
      return (
            <View>
              <View style={{marginTop:18,flexDirection:'row',width:width,backgroundColor:'white',alignItems:'center'}}>
                <Image style={{width:20,height:20,marginLeft:12}} source={this._getHeaderImg(sectionId)}/>
                <Text style={{flex:1,marginLeft:4,fontSize:13,fontWeight:'bold',color:'#333333'}}>{this._checkHeadText(sectionId)}</Text>
                <Text style={{flex:1,marginRight:4,fontSize:12,textAlign:'right',color:'#999999'}}>更多</Text>
                <Image style={{width:8,height:12,marginRight:12}} source={require('./styles/assets/icon_right@3x.png')}/>
              </View>
              {this._headerLine(sectionId)}
            </View>
      )
    }else{
      return false
    }
  }

  _renderFooter(sectionID,rowID){
    console.log('rowIdID',rowID,sectionID)
    if(sectionID === 'question'){
      if (rowID === '2'){
        return false
      }else{
        return <View style={{marginLeft:15,width:width-15,height:0.5,backgroundColor:'#e8e8e8'}}/>
      }
    }
    if(rowID === '1'){
      return (
          <View style={{height:5,backgroundColor:"#f2f2f2",width:width}}/>
      )
    }else{
      if(sectionID === 'brandme'){
        return false
      }
      if(sectionID === 'service'){
        return (
            <View style={{height:5,backgroundColor:"#f2f2f2",width:width}}/>
        )
      }
      return <View style={{marginLeft:15,width:width-15,height:0.5,backgroundColor:'#e8e8e8'}}/>
    }

  }

  _renderList() {
    if (this.state.data) {
      console.log('12344',this.state.data.lists.question)
      return(
          <ListView
              //scrollEnabled={false}
              dataSource={this.state.ds.cloneWithRowsAndSections(this.state.data.lists)}
              renderRow={(rowData,sectionID,rowId) => this._renderRow(rowData,sectionID,rowId)}
              showsVerticalScrollIndicator={false}
              renderSectionHeader={(sectionData,sectionId) => this._renderHeader(sectionData,sectionId)}
              />
      )
    } else {
      return false
    }
  }

  render() {
    return (
        <View style={{flex:1,backgroundColor:'white'}}>
          {this._renderList()}
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ListViewDemo', () => ListViewDemo);
