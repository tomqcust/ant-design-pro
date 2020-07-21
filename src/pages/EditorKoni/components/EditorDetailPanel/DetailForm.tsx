import React from 'react';
import { Card, Input, Select, Form, } from 'antd';
import { withPropsAPI } from 'gg-editor';
import jsonp from 'fetch-jsonp';
import querystring from 'querystring';
import { defaultFormat } from 'moment';
import {getProtein} from '../../service'
import {ajaxRequest} from '../../../../assets/simpleajax'


const upperFirst = (str: string) =>
  str.toLowerCase().replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase());

const { Item } = Form;
const { Option } = Select;

let timeout;
let currentValue;
const rdfs = "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>";
const rdf = "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>";
const uniprotkb = "PREFIX uniprotkb:<http://purl.uniprot.org/uniprot/>";
const sparql = "SELECT ?y WHERE {uniprotkb:A0A024R5W9 rdfs:label ?y.}"
const sparqlUrl = rdfs+rdf+uniprotkb+sparql;
//const sparqlUrl = encodeURIComponent(rdfs+rdf+uniprotkb+sparql)+"&format=html";
// const sparqlUrlA = encodeURI(rdfs+rdf+uniprotkb+sparql)+"&format=html";
// const sparqlUrlB = escape(rdfs+rdf+uniprotkb+sparql)+"&format=html";
function fetch(value, callback) {
  if (timeout) {
    console.log('timeout'+timeout);
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  
  function fake() {
    const str = querystring.encode({
      code: 'utf-8',
      q: value,
    });
    console.log(sparqlUrl);
    let obj = {"query":sparqlUrl, "format":"json"};
    let baseUrl = 'https://sparql.uniprot.org/sparql/';
    ajaxRequest(baseUrl, "GET", obj, function(this){
        console.log(this);
    });
    // const superagent = require('superagent');
    // console.log('https://sparql.uniprot.org/sparql/?query='+sparqlUrl);
    // console.log('https://sparql.uniprot.org/sparql/?query='+sparqlUrlA);
    // console.log('https://sparql.uniprot.org/sparql/?query='+sparqlUrlB);
    // superagent
    // .get('https://sparql.uniprot.org/sparql/?query='+sparqlUrl)
    // .then(res => {
    //   console.log('success');

    //   console.log(res);
    //   const  result  = JSON.parse(res.text).results.bindings;
    //       const data = [];
    //       console.log(result);
    //       result.forEach(r => {
    //         console.log(r.y.value);
    //         data.push({
    //           value: r.y.value,
    //           text: r.y.value,
    //         });
    //       });
    //       callback(data);

    //    // res.body, res.headers, res.status
    // })
    // .catch(err => {
    //   console.log('errors');
    //   console.log(err);
    //    // err.message, err.response
    // });
  //   let param = {query:'PREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+uniprotkb%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Funiprot%2F%3E%0D%0ASELECT+%3Fy%0D%0AWHERE%0D%0A%7B%0D%0A++uniprotkb%3AA0A024R5W9+rdfs%3Alabel+%3Fy.%0D%0A%7D'
  //   ,format:'json'}
  // getProtein(param).then(function(result){
  //   console.log(result.data);
  // })
    // jsonp(`https://sparql.uniprot.org/sparql/?query=PREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+uniprotkb%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Funiprot%2F%3E%0D%0ASELECT+%3Fy%0D%0AWHERE%0D%0A%7B%0D%0A++uniprotkb%3AA0A024R5W9+rdfs%3Alabel+%3Fy.%0D%0A%7D`)
    //   .then(response => response)
    //   .then(d => {
    //     console.log(d);
    //     if (currentValue === value) {
    //       const  result  = d.results.bindings;
    //       const data = [];
    //       console.log(result);
    //       result.forEach(r => {
    //         console.log(r.disease.value);
    //         data.push({
    //           value: r.disease.value,
    //           text: r.disease.value,
    //         });
    //       });
    //       callback(data);
    //     }
    //   });
  }

  timeout = setTimeout(fake, 3000);
}

const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

interface DetailFormProps {
  type: string;
  propsAPI?: any;
}

class DetailForm extends React.Component<DetailFormProps> {
  state = {
    data: [],
    value: undefined,
  };
  handleSearch = value => {
    console.log('value'+value);
    if (value) {
      fetch(value, data => this.setState({ data }));
    } else {
      console.log('shibai');
      this.setState({ data: [] });
    }
  };

  handleChange = value => {
    //console.log('handleChange'+value);
    this.setState({ value });
  };

  get item() {
    const { propsAPI } = this.props;
    return propsAPI.getSelected()[0];
  }

  handleFieldChange = (values: any) => {
    const { propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    setTimeout(() => {
      const item = getSelected()[0];
      if (!item) {
        return;
      }
      executeCommand(() => {
        update(item, {
          ...values,
        });
      });
    }, 0);
  };

  handleInputBlur = (type: string) => (e: React.FormEvent<HTMLInputElement>) => {
   // e.preventDefault();
    console.log(e+"123");
    this.setState({e});
    this.handleFieldChange({
      [type]: e,
    });
  };

  renderNodeDetail = () => {
    const { label } = this.item.getModel();
    const datasets = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    console.log(label);
    return (
      <Form initialValues={{ label }}>
        <Item label="Label" name="label" {...inlineFormItemLayout}>
          {/* <Input onBlur={this.handleInputBlur('label')} /> */}
          <Select
    showSearch
    style={{ width: 200 }}
    placeholder="Select a person"
    optionFilterProp="children"
    
    onSearch={this.handleSearch}
        onChange={this.handleInputBlur('label')}
    //onChange={this.handleInputBlur('label')}
    //onSearch={onSearch}
    filterOption={(input, option) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  >
    {datasets}
  </Select>
        </Item>
      </Form>
    );
  };

  renderEdgeDetail = () => {
    const { label = '', shape = 'flow-smooth' } = this.item.getModel();

    return (
      <Form initialValues={{ label, shape }}>
        <Item label="Label" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
        <Item label="Shape" name="shape" {...inlineFormItemLayout}>
          <Select onChange={(value) => this.handleFieldChange({ shape: value })}>
            <Option value="flow-smooth">Smooth</Option>
            <Option value="flow-polyline">Polyline</Option>
            <Option value="flow-polyline-round">Polyline Round</Option>
          </Select>
        </Item>
      </Form>
    );
  };

  renderGroupDetail = () => {
    const { label = '新建分组' } = this.item.getModel();

    return (
      <Form initialValues={{ label }}>
        <Item label="Label" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
      </Form>
    );
  };

  render() {
    const { type } = this.props;
    if (!this.item) {
      return null;
    }

    return (
      <Card type="inner" size="small" title={upperFirst(type)} bordered={false}>
        {type === 'node' && this.renderNodeDetail()}
        {type === 'edge' && this.renderEdgeDetail()}
        {type === 'group' && this.renderGroupDetail()}
      </Card>
    );
  }
}

export default withPropsAPI(DetailForm as any);
