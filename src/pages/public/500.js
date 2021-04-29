import { Component } from "react";
import { Result, Button } from "antd";
import {withRouter} from "react-router-dom";

class Error500 extends Component {
    
  render() {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary" onClick={()=>{
            this.props.history.push("/");
        }}>Back Home</Button>}
      />
    );
  }
}
export default Error500;
