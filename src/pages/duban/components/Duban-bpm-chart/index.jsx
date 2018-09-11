import React, { Component } from 'react';
import queryString from 'query-string';
import { BpmWrap } from 'yyuap-bpm';
import {Button} from 'tinper-bee';
import {actions} from 'mirrorx';
import Header from 'components/Header';

import './index.less';

class DubanBpmChart extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    onBack = ()=>{
        actions.routing.push(
            {
                pathname: 'Duban-edit',
                editFlag: false
            }
        )
    }
    render() {
        let { id, processDefinitionId, processInstanceId } = queryString.parse(this.props.location.search);
        return (
            <div>
                <Header title='流程图' back={true}/>
                <BpmWrap
                    id={id}
                    processDefinitionId={processDefinitionId}
                    processInstanceId={processInstanceId}
                />
            </div>
        );
    }
}

export default DubanBpmChart;