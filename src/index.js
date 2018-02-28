import React from 'react';
import ReactDOM from 'react-dom';
import {getUrlParams} from './js/public';
import './js/initRender';
import './css/common.css';
import './css/index.scss';
import box from './imgs/bag.png';
import pink from './imgs/pink-i.png';
import ylq from './imgs/ylq.png';
import grey_i from './imgs/grey-i.png';
import arrDown from './imgs/down-arrow.png';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showRule: false,
            cardList: [],
            num: 0,
            alldata: {}
        }
    }

    getPostList() {
        fetch('http://qa.yaomall.tvm.cn/services/GetMallCouponBag', {
            method: 'POST',
            body: JSON.stringify({
                user_id: 1,
                bag_id: getUrlParams('bag_id')
            })
        }).then((res) => {
            return res.json()
        }).then((res) => {
            console.log(res);
            this.setState({
                cardList: res.data.coupon_infos,
                alldata: res.data
            }, () => {
                console.log(this.state.cardList)
            })

        })
    };

    handleCount = () => {
        this.setState((prev) => ({
            num: prev.num + 1
        }), () => {
            console.log(this.state.num)
        })
    };
    handleCtrlRule = () => {
        this.setState(prev => ({
            showRule: !prev.showRule
        }), () => {//setstate异步后可回掉
            console.log(this.state.showRule)
        });

    };

    componentDidMount() {
        let pram = getUrlParams('idx');
        this.getPostList();
        console.log(pram)
    }

    render() {
        return (
            <div>
                <div onClick={this.handleCount}>click</div>
                <Container lists={this.state.cardList} ctrlRule={this.handleCtrlRule} num={this.state.num}
                           isnew={this.state.alldata}/>
                {
                    this.state.showRule && <PopRule close={this.handleCtrlRule}/>
                }
            </div>
        )
    }
}

class Container extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="gifts-container">
                <div>{this.props.num}</div>
                <div className="gifts-list-wrapper">
                    <GiftsHead/>
                    <GiftsRule showRule={this.props.ctrlRule}/>
                    {
                        this.props.isnew.new == '0' &&
                        <GiftsGotten num={this.props.lists.length}/>
                    }
                    <GiftsList isnew={this.props.isnew} lists={this.props.lists}/>
                </div>
            </div>
        )
    }
}

function GiftsHead() {
    return (
        <div className="gifts-list-head flex-center">
            <img src={box} alt=""/>
            <span>恭喜您，获得一个购物大礼包</span>
        </div>
    )
}

class GiftsRule extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick = () => {
        this.props.showRule()
    };

    render() {
        return (
            <div className="gifts-use-rule flex-center base-font">
                <div className="flex-center" onClick={this.handleClick}>
                    <img src={pink} alt=""/>
                    <span>礼包使用说明</span>
                </div>
            </div>
        )
    }
}

class GiftsGotten extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="gifts-gotten-look-jump flex-between">
                <span>
                    您已领过
                    <span className="pink-font">{this.props.num}</span>
                    张啦，快去个人中心查看吧！
                </span>
                <span className="pink-font flex-center">
                    去看看
                    <span className="gifts-right-icon">
                    </span>
                </span>
            </div>
        )
    }
}

class GiftsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lists: [{a: 100}, {a: 200}, {a: 300}]
        }
    }

    render() {
        const lists = this.props.lists;
        return (
            <div className="gifts-list-item-area">
                {
                    lists.map((v, i) => <GiftsItem key={i} item={v} isnew={this.props.isnew}/>)
                }
                <GiftsBtn isnew={this.props.isnew} a={1}/>
            </div>
        )
    }
}

class GiftsItem extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const item = this.props.item;
        const isnew = parseInt(this.props.isnew.new);
        return (
            <div className={'gifts-single-item'}>
                <div className="gifts-item-top-detail red-bg">
                    <div className="gifts-card-money flex-center fll">￥{item.amount}</div>
                    <div className="gifts-card-detail fll">
                        <div className="gifts-card-title">
                            {item.title}
                        </div>
                        <div className="gifts-card-msg">订单金额满{item.use_limit}元可激活</div>
                        <div
                            className="gifts-card-time">激活期限：{item.start_time.split(' ')[0].replace(/-/g, ".")}-{item.end_time.split(' ')[0].replace(/-/g, ".")}</div>
                    </div>
                    {isnew === 0 &&
                    <div className="gifts-get-btn pink-font base-font">
                        去使用
                    </div>
                    }
                    <img src={ylq} alt="" className="gifts-ylq"/>
                </div>
                <GiftsDown text={item.description}/>
            </div>
        )
    }
}

class GiftsDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            count: 0,
            rotate: ''
        }
    }

    handleClick = () => {
        this.setState(prevState => ({
            show: !prevState.show,
            rotate: !prevState.show ? ' rotate180' : ''
        }))
    };

    render() {
        return (
            <div>
                <div className="gifts-item-use-rule flex-between">
                    <div className="flex-center">
                        <img className="gifts-grey-rule-icon" src={grey_i} alt=""/>
                        <span className="grey-font">使用规则</span>
                    </div>
                    <img id="down-1" className={'gifts-grey-use-rule-down-arrow' + this.state.rotate} src={arrDown}
                         alt=""
                         onClick={this.handleClick}/>
                </div>
                {this.state.show &&
                <GiftsDownRule rule={this.props.text}/>
                }
            </div>
        )
    }
}

function GiftsDownRule(props) {
    return (
        <div className="gifts-use-rules-lists grey-font" id="data-1">
            <p>{props.rule}</p>
        </div>
    )
}

//商城按钮
class GiftsBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isnew: ''
        }
    }

    componentWillMount() {
        console.log("componentWillMount");
        console.log(this.props.a)

    }

    componentDidMount() {
        console.log("componentDidMount");
        console.log(this.state.isnew)

    }

    handleJumpOrGet = (e) => {
        console.log(this.state.isnew)
        const isnew = parseInt(this.props.isnew.new);
        //领取
        if (isnew === 1) {
            console.log('立即领取')

            fetch('http://qa.yaomall.tvm.cn/services/ReceiveCouponBag', {
                method: 'POST',
                body: JSON.stringify({
                    user_id: 1,
                    bag_id: getUrlParams('bag_id')
                })
            }).then((res) => {
                return res.json()
            }).then((res) => {
                console.log(res);

                res.status == '0' ?
                    alert('领取失败！') :
                    alert('领取成功！');window.location.reload()
            })

        } else {

        }


    };

    //此方法可接收props，将props赋值给state
    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps");
        console.log(nextProps)
        this.setState({
            isnew: nextProps.isnew.new
        })
    }

    componentWillUpdate() {
        console.log("componentWillUpdate");
        console.log(this.props.isnew.new)
    }

    render() {
        const isnew = parseInt(this.props.isnew.new);
        let text = isnew === 1 ? '立即领取' : '去商城逛逛';
        return (
            <div className="gifts-jump-btn-container flex-center">
                <div className="gifts-jump-btn flex-center" onClick={this.handleJumpOrGet}>
                    {text}
                </div>
            </div>
        )
    }
}

class PopRule extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClose = () => {
        this.props.close()
    };

    render() {
        return (
            <div className="pop-gifts-use-rule-container">
                <div className="pop-gifts-use-rule-detail-wrapper">
                    <div className="pop-gifts-use-rule-detail-title flex-center">
                        <img src={box} alt=""/>
                        <span>礼包使用说明</span>
                    </div>
                    <div className="pop-gifts-use-rule-detail-txt">
                    </div>
                    <div className="pop-gifts-use-rule-close" onClick={this.handleClose}>×</div>
                </div>
            </div>
        )
    }
}


ReactDOM.render(<App/>, document.getElementById('app'));



























