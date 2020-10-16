import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Rate, Form, Input, Select, message } from 'antd';
import Style from './style/Main.module.css';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

function CommomMain(props) {
    const [dataSource, setDataSource] = useState();
    // const [rateDisabled,setRateDisabled] = useState(true);
    const getAll = () => {
        axios({
            method: "get",
            url: "http://192.168.50.83:4000/getSource",
        }).then(res => {
            let list = res.data.data.map(item => {
                let scoreAfter = item.score;
                return (
                    <div key={item.code} style={{ margin: "60px 50px 50px 0px", display: "inline-block", textAlign: "left" }}>
                        <p>名称：{item.name}</p>
                        <p>类型：{item.type === "0" ? "书籍" : item.type}</p>
                        <div>
                            <span>评分：{item.score}</span>
                            <Rate defaultValue={item.score} style={{ display: "block" }} onChange={(value) => { scoreAfter = value }} />
                        </div>
                        <div>
                            <span onClick={() => { setRateShow(item.code) }}>看过，我要评分：</span>
                            <div className="rate" data-code={item.code} >
                                <Rate defaultValue={0} onChange={(value) => { userChangeScore(item.code, value) }} />
                            </div>
                        </div>
                    </div>
                )
            })
            setDataSource(list)
        })
    }

    // const [rateShow,setRateShow] = useState();
    // useEffect(
    //     () => {
    //         console.log(rateShow)
    //     },[rateShow]
    // )
    const setRateShow = (code) => {
        console.log(document.getElementsByClassName("rate"));
        let rate = Array.prototype.slice.call(document.getElementsByClassName("rate"));
        rate.forEach(item => {
            item.style.display = "none";
        });
        document.querySelector(`div[data-code="${code}"]`).style.display = "block"
    }

    useEffect(
        () => {
            axios({
                method: "get",
                url: "http://192.168.50.83:4000/getSource",
            }).then(res => {
                let list = res.data.data.map(item => {
                    let scoreAfter = item.score;
                    return (
                        <div key={item.code} style={{ margin: "60px 50px 50px 0px", display: "inline-block", textAlign: "left" }}>
                            <p>名称：{item.name}</p>
                            <p>类型：{item.type === "0" ? "书籍" : item.type}</p>
                            <div>
                                <span>评分：{item.score}</span>
                                <Rate defaultValue={item.score} style={{ display: "block" }} onChange={(value) => { scoreAfter = value }} />
                            </div>
                            <div>
                                <span onClick={() => { setRateShow(item.code) }}>看过，我要评分：</span>
                                <div className="rate" data-code={item.code} >
                                    <Rate defaultValue={0} onChange={(value) => { userChangeScore(item.code, value) }} />
                                </div>
                            </div>
                        </div>
                    )
                })
                setDataSource(list)
            })
        }, []
    );

    const userChangeScore = (workCode, score) => {
        const data = { userName: cookies.get('userName'), workCode, score };
        console.log(data)
        axios({
            method: "post",
            url: "http://192.168.50.83:4000/user/setScore",
            data: data
        }).then(res => {
            getAll();
            setTimeout(
                () => {
                    let rate = Array.prototype.slice.call(document.getElementsByClassName("rate"));
                    rate.forEach(item => {
                        item.style.display = "none";
                    });
                    message.success("评分成功")
                }, 500
            )

        })
    }

    const [changeSource, setChangeSource] = useState(true);
    const [lookSource, setLookSource] = useState([]);

    const changeBottom = () => {
        setChangeSource(false)
        axios({
            method: "get",
            url: "http://192.168.50.83:4000/user/getSource",
            params: {
                userName: cookies.get('userName')
            }
        }).then(res => {
            let list = [];
            res.data.data.forEach(item => {
                axios({
                    method: "get",
                    url: "http://192.168.50.83:4000/userCode/getSource",
                    params: {
                        userName: cookies.get('userName'),
                        workCode: item.code
                    }
                }).then(res => {
                    return (
                        <div key={item.code} style={{ margin: "60px 50px 50px 0px", display: "inline-block", textAlign: "left" }}>
                            <p>名称：{item.name}</p>
                            <p>类型：{item.type === "0" ? "书籍" : item.type}</p>
                            <div>
                                <span>总评分：{item.score}</span>
                                <Rate defaultValue={item.score} disabled />
                            </div>
                            <div>
                                <span>我的评分：{res.data.data}</span>
                                <Rate defaultValue={res.data.data} disabled />
                            </div>
                        </div>
                    )
                }).then(res => {
                    list = [...lookSource];
                    list.push(res)
                    console.log(list)
                    setLookSource(list)
                })
            })
        })
    }
    return (
        <div className={Style.Main}>
            <p>
                昵称：{cookies.get('nickname')}
                <button onClick={() => { props.setLoginSucess(false); cookies.set('loginSucess', false) }}>退出</button>
                <button onClick={changeBottom}>我看过</button>
            </p>
            {
                changeSource ?
                    <div className={Style.dataSource}>
                        {dataSource}
                    </div> :
                    <div className={Style.dataSource}>
                        {lookSource}
                    </div>
            }


        </div>
    );
}

export default CommomMain;
