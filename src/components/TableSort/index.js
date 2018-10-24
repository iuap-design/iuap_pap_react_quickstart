import React, { Component } from 'react';
import { Icon } from 'tinper-bee';
import PropTypes from 'prop-types';
import './index.less';
import classnames from 'classnames';

const propTypes = {
    downFn: PropTypes.func,//点击降序的回调
    upFn: PropTypes.func,//点击升序的回调
    title: PropTypes.string.isRequired //header名称，必填
};

const defaultProps = {
    downFn: () => {
        window.history.go(-1);
    },
    upFn: () => {
        window.history.go(-1);
    },
    title: ''
};


class TableSort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sort:'up'
        };
    }
    down=()=>{

    }
    render() {
        const { downFn, upFn, title,className} = this.props;
        let classes=className?'table-sort '+className:'table-sort';
        return (
            <div className={classes}>
               {title}
                <div className='table-sort-icon'>
                    <span>
                        <Icon type="uf-triangle-up"  onClick={this.down}/>
                    </span>
                    <span>
                        <Icon type="uf-triangle-down" onClick={this.up} />
                    </span>
                </div>
            </div>
        )
    }
}
TableSort.propTypes = propTypes;
TableSort.defaultProps = defaultProps;
export default TableSort;
