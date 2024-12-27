// ==UserScript==
// @name         鱼派小尾巴
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  try to thank APTX-4869!
// @author       (江户川-哀酱)APTX-4869
// @match        https://fishpi.cn/cr
// @icon         https://fishpi.cn/images/favicon.png
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    'use strict';
    const version_us = "v1.6.1";
    var heads = document.getElementsByTagName("head");
    var link = document.getElementsByTagName("link");
    var suffixFlag = window.localStorage['xwb_flag'] ? JSON.parse(window.localStorage['xwb_flag']) : false;
    var tongji_flag = window.localStorage['fish_game_flag'] ? parseInt(window.localStorage['fish_game_flag']) : -1;
    var autoParseFlag = true;
    var borderFlag = window.localStorage['borderFlag'];
    var lspCDKEY = window.localStorage['lspCDKEY'];
    var focusStorage = window.localStorage['focus_users'] ? window.localStorage['focus_users'] : "";
    var focus_users = focusStorage.split(",");
    // console.log(lspCDKEY);
    GM_registerMenuCommand("小尾巴开关", () => {
        suffixFlag = !suffixFlag;
        window.localStorage['xwb_flag'] = suffixFlag;
        xwb_btn.textContent = suffixFlag? '小尾巴：on' : '小尾巴：off';
    });
    GM_registerMenuCommand("渔场游戏统计", () => {
        tongji_flag = tongji_flag * -1;
        window.localStorage['fish_game_flag'] = tongji_flag;
        console.log("渔场游戏统计" + (tongji_flag > 0 ? "开启" : "关闭"));
        window.location.reload();
    });
    GM_registerMenuCommand("聊天框边框", () => {
        window.localStorage['borderFlag'] = Number.isNaN(parseInt(window.localStorage['borderFlag'])) ? 1 : parseInt(window.localStorage['borderFlag']) * -1;
        window.location.reload();
    });
    GM_registerMenuCommand("修改cdkey", () => {
        var cdkey = prompt("请输入cdkey（只要不清空缓存就无需重复修改）", window.localStorage['lspCDKEY']);
        if (cdkey === null) {
            return;
        }
        window.localStorage['lspCDKEY'] = cdkey;
        window.location.reload();
    });
    GM_registerMenuCommand("特别关注提醒", () => {
        var focusParam = prompt("请输入你想要收到消息提醒的吊毛用户id，多个用户之间用英文的逗号隔开", window.localStorage['focus_users'] ? window.localStorage['focus_users'] : "");
        if (focusParam.trim().length > 0) {
            focus_users = focusParam.split(",");
            window.localStorage['focus_users'] = focusParam;
        } else {
            focus_users = [];
            window.localStorage['focus_users'] = focusParam;
        }
    });
    if (borderFlag > 0) {
        var color = prompt("请输入三个16进制的色值，用英文逗号隔开", "#8f41e9,#578aef,#ff5277");
        if (color === null) {
            return;
        }
        var css = [
            ".chats__content{",
            "border-radius: 10px;",
            "border: 5px solid;",
            "border-image: linear-gradient(" + color + ")30 30;",
            "background-position: -100px 1px, calc(100% - 1px) -100px, calc(100% + 100px) calc(100% - 1px), 1px 0px;",
            "animation: moveLine 8s infinite linear;",
            "};",
            "@keyframes moveLine { 0% { background-position: -100px 1px, calc(100% - 1px) -100px, calc(100% + 100px) calc(100% - 1px), 1px 0px; } 30% { background-position: 100% 1px, calc(100% - 1px) -100px, calc(100% + 100px) calc(100% - 1px), 1px -100px; } 50% { background-position: calc(100% + 100px) 1px, calc(100% - 1px) 100%, calc(100% + 100px) calc(100% - 1px), -100px -100px; } 80% { background-position: calc(100% + 100px) 1px, calc(100% - 1px) calc(100% + 100px), 0px calc(100% - 1px), 1px calc(100% + 100px); } 100% { background-position: calc(100% + 100px) 1px, calc(100% - 1px) calc(100% + 100px), -100px calc(100% - 1px), 1px 0px; } }",
        ].join("\n");
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        heads[0].appendChild(node);
    }

    function getHYD() {
        var hyd;
        $.ajax({
            url: "https://fishpi.cn/user/liveness?_timestemp",
            type: "GET",
            async: false,
            success: function (e) {
                hyd = e.liveness;
            }
        });
        return hyd;
    }

    for (let i = 0; i < link.length; i++) {
        if (link[i].rel == 'icon') {
            link[i].href = 'https://www.baidu.com/img/baidu_85beaf5496f291521eb75ba38eacbd87.svg';
        }
    }
    // Your code here...
    ChatRoom.send = function (needwb) {
        var hyd = getHYD();
        var wbMsg = '\n\n\n> ——嘀嘀🎉[' + hyd + '%] [如何使用小尾巴](https://fishpi.cn/article/1658802906181) ';
        var t, e;
        ChatRoom.isSend || (ChatRoom.isSend = !0,
            e = {
                content: t = ChatRoom.editor.getValue(),
                client: "Web/小尾巴" + version_us
            },
            ChatRoom.editor.setValue(""),
            $.ajax({
                url: Label.servePath + "/chat-room/send",
                type: "POST",
                cache: !1,
                data: JSON.stringify({
                    content: t.trim().length == 0 || (!suffixFlag) || needwb == 0 || t.trim().startsWith('凌 ') || t.trim().startsWith('鸽 ') || t.trim().startsWith('小冰 ') || t.trim().startsWith('点歌 ') || t.trim().startsWith('TTS ') || t.trim().startsWith('朗读 ') ? t : t + wbMsg,
                    client: "Web/小尾巴" + version_us
                }),
                beforeSend: function () {
                    $(".form button.red").attr("disabled", "disabled").css("opacity", "0.3")
                },
                success: function (e) {
                    0 === e.code ? $("#chatContentTip").removeClass("error succ").html("") : ($("#chatContentTip").addClass("error").html("<ul><li>" + e.msg + "</li></ul>"),
                        ChatRoom.editor.setValue(t))
                },
                error: function (e) {
                    $("#chatContentTip").addClass("error").html("<ul><li>" + e.statusText + "</li></ul>"),
                        ChatRoom.editor.setValue(t)
                },
                complete: function (e, t) {
                    ChatRoom.isSend = !1,
                        $(".form button.red").removeAttr("disabled").css("opacity", "1")
                }
            }))
    };


    // 获取列表
    var x = document.getElementsByClassName('reply')[0];
    // 创建 div 图层
    var elve = document.createElement("div");


     // 获取列表
    var x = document.getElementsByClassName('reply')[0];
    // 创建 div 图层
    var elve = document.createElement("div");

    // 信息
    var info = document.createElement("button");
    info.id = "info";
    info.textContent = "精灵背包";
    info.className = "red";
    info.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    info.onclick = function () {
        sendMsgApi("凌 背包");
        return;
    };


    var word = document.createElement("button");
    word.id = "word";
    word.textContent = "小冰红包";
    word.className = "red";
    word.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    word.onclick = function () {
        sendMsgApi("小冰 来个红包 " + getRandomInt(10, 99));
        return;
    };

    // 信息
    var dlw = document.createElement("button");
    dlw.id = "info";
    dlw.textContent = "参与欢乐时光";
    dlw.className = "green";
    dlw.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    dlw.onclick = function () {
        var redPacketData = {
            "content": "[redpacket]{\"type\":\"specify\",\"money\":\"128\",\"count\":\"1\",\"msg\":\"总不能一直不出1吧\",\"recivers\":[\"sevenSummer\"]}[/redpacket]",
            "client": "Web/小尾巴快捷端" + version_us
        };
        $.ajax({
            url: "https://fishpi.cn/chat-room/send",
            type: "POST",
            async: false,
            data: JSON.stringify(redPacketData),
            success: function (e) {

            }
        });
    };

    // 打劫
    var jl_hlsg = document.createElement("button");
    jl_hlsg.id = "hlsg";
    jl_hlsg.textContent = "开启欢乐时光";
    jl_hlsg.className = "red";
    jl_hlsg.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    jl_hlsg.onclick = function () {
        sendMsgApi("凌 欢乐时光");
    };

    // 打劫
    var sxw = document.createElement("button");
    sxw.id = "dj";
    sxw.textContent = "打劫";
    sxw.className = "red";
    sxw.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    sxw.onclick = function () {
        sendMsgApi("小冰 去打劫");
        sendMsgApi("凌 去探索");
    };

    // 乞讨
    var ge_qt = document.createElement("button");
    ge_qt.id = "qt";
    ge_qt.textContent = "乞讨";
    ge_qt.className = "red";
    ge_qt.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    ge_qt.onclick = function () {
        sendMsgApi("鸽 行行好吧");
        // sendMsgApi("小冰 开盲盒");
    };

    // 盲盒
    var ice_mh = document.createElement("button");
    ice_mh.id = "mh";
    ice_mh.textContent = "小冰盲盒";
    ice_mh.className = "red";
    ice_mh.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    ice_mh.onclick = function () {
        // sendMsgApi("鸽 行行好吧");
        sendMsgApi("小冰 开盲盒");
    };

    // 捡鱼叉
    var jl_jyc = document.createElement("button");
    jl_jyc.id = "jyc";
    jl_jyc.textContent = "捡鱼叉";
    jl_jyc.className = "red";
    jl_jyc.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    jl_jyc.onclick = function () {
        sendMsgApi("凌 捡鱼叉 " + getRandomInt(0,99));
    };

    // biu
    var jl_biu = document.createElement("button");
    jl_biu.id = "yyc";
    jl_biu.textContent = "biu";
    jl_biu.className = "red";
    jl_biu.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    jl_biu.onclick = function () {
        sendMsgApi("凌 biu vmet " + getRandomInt(0,99));
    };

    // 精灵的周四/五/六事件
    var jl_week = document.createElement("button");
    jl_week.id = "yyc";
    jl_week.textContent = "周四/五/六";
    jl_week.className = "red";
    jl_week.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    jl_week.onclick = function () {
        var msg = '';
        var t = getWeek();
        if (t == 4) {
            msg = '凌 V50'
        } else if (t == 5) {
            msg = '凌 TGIF'
        } else if (t == 6) {
            msg = '凌 窝囊费'
        } else {
            return;
        }
        sendMsgApi(msg);
    };

    // 小尾巴开关
    var xwb_btn = document.createElement("button");
    xwb_btn.id = "yyc";
    xwb_btn.textContent = suffixFlag? '小尾巴：on' : '小尾巴：off';
    xwb_btn.className = "red";
    xwb_btn.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    xwb_btn.onclick = function () {
        suffixFlag = !suffixFlag;
        console.log('小尾巴：' + suffixFlag);
        xwb_btn.textContent = suffixFlag ? '小尾巴：on' : '小尾巴：off';
        window.localStorage['xwb_flag'] = suffixFlag;
    };

     // roll
    var ge_roll = document.createElement("button");
    ge_roll.id = "rol";
    ge_roll.textContent = "roll";
    ge_roll.className = "red";
    ge_roll.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    ge_roll.onclick = function () {
        // sendMsgApi("鸽 行行好吧");
        sendMsgApi("鸽 ROLL " + getRandomInt(0,99));
    };

    // roll
    var ge_qa = document.createElement("button");
    ge_qa.id = "rol";
    ge_qa.textContent = "勇士题";
    ge_qa.className = "red";
    ge_qa.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    ge_qa.onclick = function () {
        // sendMsgApi("鸽 行行好吧");
        sendMsgApi("鸽 勇士题 " + getRandomInt(0,99));
    };

    elve.appendChild(ge_roll);
    elve.appendChild(ge_qa);
    elve.appendChild(jl_jyc);
    elve.appendChild(jl_biu);
    elve.appendChild(ice_mh);
    elve.appendChild(ge_qt);
    elve.appendChild(jl_week);
    elve.appendChild(sxw);
    elve.appendChild(jl_hlsg);
    elve.appendChild(dlw);
    elve.appendChild(info);
    elve.appendChild(word);
    elve.appendChild(xwb_btn);
    elve.id = "elves";
    elve.align = "right";
    x.appendChild(elve);

    function sendMsgApi(msg){
        var redPacketData = {
            "content": msg,
            "client": "Web/小尾巴快捷端" + version_us
        };
        $.ajax({
            url: "https://fishpi.cn/chat-room/send",
            type: "POST",
            async: false,
            data: JSON.stringify(redPacketData),
            success: function (e) {

            }
        });
    }

        // 获取随机整数
    function getRandomInt(m, n) {
        return Math.floor(Math.random() * (n - m + 1)) + m;
    }

    function getWeek() {
        return new Date().getDay();
    }


    ChatRoom.repeat = function (e) {
        let t = "";
        $.ajax({
            url: Label.servePath + "/cr/raw/" + e,
            method: "get",
            async: !1,
            success: function (e) {
                t = e.replace(/(<!--).*/g, "")
            }
        }), ChatRoom.editor.setValue(t), ChatRoom.send(0), $(window).scrollTop(0)
    };

    ChatRoom.plusOne = function () {
        ChatRoom.editor.setValue(Label.latestMessage), ChatRoom.send(0)
    };


    // 私信重连
    function reSevenSummer() {
        $("#noteMsgList").html('');
        PrivateWss.close();
        initPrivateChannel();
    }

    // 渲染记事本
    if (tongji_flag > 0) {
        var personInfo = $(".side").eq(0).find(".person-info").eq(0);
        personInfo.after('<div class="module note" style="width: 100%;height: 200px;overflow: hidden;"><div class=""><div type="text" style="width: 100%;height: 30px;padding: 5px 55px 5px 10px;box-sizing: border-box;border: 1px solid #eee;font-size: 12px;background-color: #000;color: #FFF;">精灵消息<span style="position: absolute;right: 45px;cursor: pointer;" id="fishDetail">收益统计</span><span style="position: absolute;right: 10px;cursor: pointer;" id="reconnectSevenSummer">重连</span></div></div>');
        $(".note").eq(0).append('<div id="noteMsgList" style="width: 100%;height: 180px;overflow-y: scroll;"></div>');
    }

    $("#reconnectSevenSummer").click(function() {
        $("#noteMsgList").html('');
        PrivateWss.close();
        initPrivateChannel();
    });

    // 监听私信
    // Label.node.apiKey
    let privateChatHB;
    var PrivateWss;
    function initPrivateChannel() {
        if (tongji_flag < 0) {
            return;
        }
        PrivateWss = new WebSocket("wss://fishpi.cn/chat-channel?apiKey=" + Label.node.apiKey + "&toUser=sevenSummer");
        PrivateWss.onopen = function() {
            renderNoteMsg("精灵已连接……")
        }
        ,
        PrivateWss.onmessage = function(e) {
            var t = JSON.parse(e.data);
            if (!t.markdown) {
                return
            }
            renderNoteMsg(t.markdown);
            tongji(t.markdown, t.content);
        }
        ,
        PrivateWss.onclose = function() {
            renderNoteMsg("精灵失去连接，请点击重连，重连后，私信消息将清空")
        }
        ,
        PrivateWss.onerror = function(e) {
            console.log("ERROR", e)
        }
    }

    // 渲染记事本消息
    function renderNoteMsg(e) {
        $("#noteMsgList").prepend('<div class="allNoteMsg" style="display: flex;margin: 10px;"><div class="ice-msg-content" style="position: relative;background-color: var(--background-secondary-color);border-radius: 5px;padding: 8px 15px;overflow: initial;max-width: 75%;font-size: 12px;box-sizing: border-box;">' + e + '</div></div>')
    }

    async function waitWss(e) {
        if (e != 1) {
            while (!ChatRoomChannel.ws) {
                console.log('等待连接...');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            console.log('聊天室已连接');
        }
        if (ChatRoomChannel.ws || e == 1) {
            ChatRoomChannel.ws.onmessage = function (e) {
                var o = JSON.parse(e.data);

                //console.log(a);
                switch (o.type) {
                    case "barrager":
                        var s = o.barragerContent,
                            l = o.barragerColor,
                            r = o.userName,
                            i = o.userAvatarURL,
                            c = o.userNickname;
                        let e = "";
                        i = {
                            img: i,
                            info: e = "" != c && null != c ? c + ": " + s : r + ": " + s,
                            href: Label.servePath + "/member/" + r,
                            close: !1,
                            speed: Math.round(10 * Math.random() + 10),
                            color: l
                        };
                        $("body").barrager(i);
                        break;
                    case "discussChanged":
                        c = o.whoChanged,
                            s = o.newDiscuss,
                            r = "<div class='newDiscussNotice' style='color: rgb(50 50 50);margin-bottom: 8px;text-align: center;display: none;'><svg><use xlink:href='#pound'></use></svg>&nbsp;<a href=\"" + Label.servePath + "/member/" + c + '" target="_blank">' + c + "</a> 编辑了话题：<a href='javascript:void(0)' style='text-decoration: none'>" + s + "</a></div>";
                        $("#chats").prepend(r),
                            $(".newDiscussNotice").slideDown(500),
                            $("#discuss-title").text(s);
                        break;
                    case "redPacketStatus":
                        var l = o.whoGive,
                            i = o.whoGot,
                            c = o.got,
                            r = o.count,
                            s = o.oId,
                            d = o.dice;
                        let n;
                        if (null == d)
                            n = '<a href="' + Label.servePath + "/member/" + i + '" target="_blank">' + i + '</a> 抢到了 <a href="' + Label.servePath + "/member/" + l + '" target="_blank">' + l + '</a> 的 <a style="cursor: pointer" onclick="ChatRoom.unpackRedPacket(\'' + s + "')\">红包</a>";
                        else {
                            let e;
                            switch (d.bet) {
                                case "big":
                                    e = "大";
                                    break;
                                case "small":
                                    e = "小";
                                    break;
                                case "leopard":
                                    e = "豹子"
                            }
                            var m = d.chips;
                            n = '<a href="' + Label.servePath + "/member/" + i + '" target="_blank">' + i + '</a> 在 <a href="' + Label.servePath + "/member/" + l + '" target="_blank">' + l + '</a> 的 <a style="cursor: pointer" onclick="ChatRoom.bet(\'' + s + "')\">盘口</a> 下注" + m + "积分买" + e
                        }
                        c === r ? ($("#chatroom" + o.oId).find(".hongbao__item").css("opacity", ".36"),
                                   $("#chatroom" + o.oId).find(".redPacketDesc").html("已经被抢光啦"),
                                   n += null == d ? "，红包已被领完 (" + c + "/" + r + ")" : "，已封盘 (" + c + "/" + r + ")") : n += " (" + c + "/" + r + ")";
                        i = "<div class='redPacketNotice' style='color: rgb(50 50 50);margin-bottom: 8px;text-align: center;display: none;'><svg><use xlink:href='#redPacketIcon'></use></svg>&nbsp;" + n + "</div>";
                        $("#chats").prepend(i),
                            $(".redPacketNotice").slideDown(500);
                        break;
                    case "online":
                        for (var h in $("#discuss-title").text(o.discussing),
                             $("#onlineCnt").text(o.onlineChatCnt),
                             $("#indexOnlineChatCnt").text(o.onlineChatCnt),
                             Label.onlineAvatarData = "",
                             o.users) {
                            h = o.users[h];
                            Label.onlineAvatarData += '<a target="_blank" data-name="' + h.userName + '"\nhref="' + h.homePage + '">\n<img style=\'margin-bottom: 10px\' class="avatar avatar-small" aria-label="' + h.userName + '"\nsrc="' + h.userAvatarURL48 + '">\n</a>'
                        }
                        Util.listenUserCard();
                        break;
                    case "revoke":
                        $("#chatroom" + o.oId).remove(),
                            $("#chatindex" + o.oId).remove();
                        break;
                    case "refresh":
                        $("#chats").empty(),
                            page = 0,
                            ChatRoom.more();
                        break;
                    case "customMessage":
                        var aptx = "<div class='customNotice' style='color: rgb(118 118 118);margin-bottom: 12px;text-align: center;display: none;'>" + '官方礼仪-哀酱说：请注意，贵宾VIP即将动身💓' + "</div>";
                        $("#chats").prepend(aptx),
                            $(".customNotice").slideDown(500);
                        r = "<div class='customNotice' style='color: rgb(118 118 118);margin-bottom: 12px;text-align: center;display: none;'>" + o.message + "</div>";
                        $("#chats").prepend(r),
                            $(".customNotice").slideDown(500);
                        break;
                    case "msg":

                        // 此处监听特别关注列表用户
                        if (focus_users.includes(o.userName)) {
                            var notificat = new Notification('特别关注：', {
                                dir: 'rtl', //dir : 文字的方向；它的值可以是 auto（自动）, ltr（从左到右）, or rtl（从右到左）
                                body: o.userName + ' 出现了，快来跟TA互动吧'//body: 通知中额外显示的字符串
                            });
                        }

                        d = o.userName;
                        let t = o.content;
                        let md = o.md,
                            avatar = o.userAvatarURL;
                        var myCatchUsersParam = window.localStorage['robot_list'];
                        let myCatchUsers = [];
                        if (myCatchUsersParam && myCatchUsersParam.length > 0) {
                            myCatchUsers = myCatchUsersParam.split(",");
                        }
                        if (myCatchUsers.includes(d) && (-1 == t.indexOf('"msgType":"redPacket"') && -1 == t.indexOf('"msgType":"weather"') && -1 == t.indexOf('"msgType":"music"'))) {
                            var i = '<div class="robot-msg-item"><div class="avatar" style="background-image: url(' + avatar + ')"></div><div class="robot-msg-content"><div class="robot-username"><p>' + d + "</p></div> " + t + ' <div class="fn__right" style="margin-top: 5px; font-size: 10px;">' + o.time + "</div></div></div>";
                            ChatRoom.addRobotMsg(i)
                        } else if ($("#catch-word").prop("checked") && -1 == t.indexOf('"msgType":"redPacket"') && (md.startsWith("鸽 ") || md.startsWith("小冰 ") || md.startsWith("凌 ") || md.startsWith("ida "))) {
                            var r = '<div class="robot-msg-item"><div class="avatar" style="background-image: url(' + avatar + ')"></div><div class="robot-msg-content"><div class="robot-username"><p>' + d + "</p></div> " + t + ' <div class="fn__right" style="margin-top: 5px; font-size: 10px;">' + o.time + "</div></div></div>";
                            ChatRoom.addRobotMsg(r)
                        } else {
                            0 === $("#chatRoomIndex").length && $("#chatroom" + o.oId).length <= 0 && (ChatRoom.renderMsg(o),
                                                                                                       ChatRoom.resetMoreBtnListen()),
                                0 !== $("#chatRoomIndex").has("#emptyChatRoom").length && $("#emptyChatRoom").remove();
                            let e = o.userNickname;
                            e = void 0 !== e && "" !== e ? e + " ( " + d + " )" : d,
                                -1 !== t.indexOf('"msgType":"redPacket"') && (t = "[收到红包，请在完整版聊天室查看]"),
                                $("#chatRoomIndex").prepend('<li class="fn-flex" id="chatindex' + o.oId + '" style=\'display: none; border-bottom: 1px solid #eee;\'>\n    <a rel="nofollow" href="/member/' + o.userName + '">\n        <div class="avatar tooltipped tooltipped-n"\n             aria-label="' + o.userName + '"\n             style="background-image:url(\'' + o.userAvatarURL48 + '\')"></div>\n    </a>\n    <div class="fn-flex-1">\n        <div class="ft-smaller">\n            <a rel="nofollow" href="/member/' + o.userName + '">\n                <span class="ft-gray">' + e + '</span>\n            </a>\n        </div>\n        <div class="vditor-reset comment ' + Label.chatRoomPictureStatus + '">\n            ' + t + "\n        </div>\n    </div>\n</li>"),
                                11 === $("#chatRoomIndex li.fn-flex").length && $("#chatRoomIndex li.fn-flex:last").fadeOut(199, function() {
                                $("#chatRoomIndex li.fn-flex:last").remove()
                            }),
                                $("#chatRoomIndex li:first").slideDown(200),
                                Util.listenUserCard(),
                                "object" == typeof ChatRoom && ChatRoom.imageViewer()
                        }
                }
                //自动解密
                /* if (autoParseFlag) {
            var baiziMsgArr = document.getElementsByClassName('kaibai');
            if (baiziMsgArr.length > 0) {
                var codeStr = baiziMsgArr[0].innerText;
                let newStr = "https://sexy.1433.top/" + codeStr + '?token=' + lspCDKEY;
                var details_dom = document.createElement("details");
                var summary_dom = document.createElement('summary');
                summary_dom.innerText = '解密：';
                details_dom.append(summary_dom);
                var oA = document.createElement("img");
                oA.src = newStr;
                oA.referrerPolicy = "no-referrer";
                details_dom.append(oA);
                baiziMsgArr[0].after(details_dom);
                baiziMsgArr[0].setAttribute('class', 'complate_span')
            }
        }*/

            };
        } else {console.info('消息监听失败')}
        if (e != 1) {initPrivateChannel();}
    }

    if (tongji_flag > 0) {
        waitWss();
    }

    $("#fishDetail").click(function() {
        // 收益统计
        Util.alert("" +
            "<div class=\"form fn__flex-column\">\n" +
            "<label>\n" +
            "<table><tbody>" +
            "   <tr><th>叉得鱼翅</th><th>biu得鱼翅</th><th>biu得鱼丸</th><th>暴雨梨花</th></tr>" +
            "   <tr><td>"+fish_tongji.yuchi+"</td><td>"+fish_tongji.biuYuchi+"</td><td>"+fish_tongji.yuwan+"</td><td>"+fish_tongji.byYuchi+"</td></tr>" +
            "   <tr><th>橙色鱼叉</th><th>紫色鱼叉</th><th>白色鱼叉</th><th>五换一</th></tr>" +
            "   <tr><td>"+fish_tongji.chengse+"</td><td>"+fish_tongji.zise+"</td><td>"+fish_tongji.baise+"</td><td>"+fish_tongji.five2one+"</td></tr>" +
            "   <tr><th>捡鱼叉</th><th>欢乐时光</th><th>口令红包</th><th>鱼叉净收益</th></tr>" +
            "   <tr><td>"+fish_tongji.cishu+"</td><td>"+fish_tongji.huanle+"</td><td>"+fish_tongji.kouling+"</td><td>"+fish_tongji.total+"</td></tr>" +
            "</tbody>\n" +
            "</table>\n" +
            "</label>\n" +
            "<div class=\"fn-hr5\"></div>\n" +
            "<div class=\"fn__flex\" style=\"margin-top: 15px; justify-content: flex-end;\">\n" +
            "  <button class=\"btn btn--confirm\" onclick='Util.copyTongji();'>复制</button>\n" +
            "  <button class=\"btn btn--confirm\" onclick='Util.reTongji();' style=\"margin-left: 10px;\">重置</button>\n" +
            "</div>\n" +
            "</div>" +
            "", "渔场游戏收益统计：[" + fish_tongji.dateStr + "]开始");
    });

    // 复制统计内容
    Util.copyTongji = async function copyTongji() {
        var text = "渔场游戏收益统计：[" + fish_tongji.dateStr + "]开始\n";
        text += "| 叉得鱼翅 | biu得鱼翅 | biu得鱼丸 | 暴雨梨花 |\n";
        text += "|-------|-------|-------|-------|\n";
        text += "| "+ fish_tongji.yuchi +" | "+fish_tongji.biuYuchi+" | "+fish_tongji.yuwan+" | "+fish_tongji.byYuchi+" |\n";
        text += "| 橙色鱼叉 | 紫色鱼叉 | 白色鱼叉 | 五换一 |\n";
        text += "| "+fish_tongji.chengse+" | "+fish_tongji.zise+" | "+fish_tongji.baise+" | "+fish_tongji.five2one+" |\n";
        text += "| 捡鱼叉 | 欢乐时光 | 口令红包 | 鱼叉净收益 |\n";
        text += "| "+fish_tongji.cishu+" | "+fish_tongji.huanle+" | "+fish_tongji.kouling+" | "+fish_tongji.total+" |\n";
        await navigator.clipboard.writeText(text);
        Util.closeAlert();
    }
    // 重置
    Util.reTongji = function reTongji() {
        // console.log('重置');
        fish_tongji = newOpt;
        fish_tongji.dateStr = new Date().toLocaleString();
        fish_tongji.date = new Date().getDate();
        window.localStorage['fish-tongji'] = JSON.stringify(fish_tongji);
        Util.closeAlert();
    }

    //统计
    var newOpt = {
        yuchi: 0,
        biuYuchi: 0,
        total: 0,
        yuwan: 0,
        chengse: 0,
        zise: 0,
        baise: 0,
        cishu: 0,
        huanle: 0,
        kouling: 0,
        five2one: 0,
        byYuchi: 0,
        dateStr: new Date().toLocaleString(),
        date: new Date().getDate()
    };
    var fish_tongji = window.localStorage['fish-tongji'] ? JSON.parse(window.localStorage['fish-tongji']) : newOpt;
    async function tongji(markDown, content) {
        try {
            if (new Date().getDate() != fish_tongji.date) { // 隔日重置
                console.log('重置')
                fish_tongji = newOpt;
                fish_tongji.dateStr = new Date().toLocaleString();
                fish_tongji.date = new Date().getDate();
            }
            if (markDown.match(/您获得了 ...\d+ 个... .{2}. 已到账...\[来源: 你的鱼叉/)) {
                var match = markDown.match(/\d+/);
                match = parseInt(match[0]);
                if (match) {
                    if (markDown.indexOf('鱼翅') > -1) {
                        fish_tongji.yuchi = fish_tongji.yuchi + match
                        fish_tongji.total += match
                        fish_tongji.biuYuchi += match
                    } else {
                        fish_tongji.yuwan = fish_tongji.yuwan + match
                    }
                }
            } else if (markDown.indexOf('亲爱的玩家. 你拿出渔网里的东西一看. 竟然是') > -1 || markDown.indexOf('亲爱的玩家. 你踩在沙滩上感觉有什么东西硌脚, 抬起脚一看. 竟然是') > -1) {
                var name = markDown.substring(markDown.indexOf('`') + 1, markDown.lastIndexOf('`'));
                console.log(name)
                switch (name) {
                    case '橙色鱼叉':
                        fish_tongji.chengse += 1;
                        break
                    case '紫色鱼叉':
                        fish_tongji.zise += 1;
                        break
                    case '白色鱼叉':
                        fish_tongji.baise += 1;
                        break
                    default:
                        break
                }
            } else if (markDown.indexOf('亲爱的玩家. 由于你的橙色品质强化已到顶峰, 触发橙色隐藏功能-CV. 又获得了一把鱼叉~') > -1) {
                fish_tongji.chengse += 1
                console.log('CV')
            } else if (markDown.indexOf('您失去了 ...5 个... 鱼翅. 已扣除...[来源: 聊天室游戏-捡鱼叉]') > -1) {
                fish_tongji.cishu += 1
                fish_tongji.total -= 5
            } else if (markDown.match(/您获得了 ...\d+ 个... 鱼翅. 已到账...\[来源: 欢乐时光兑换鱼翅/)) {
                fish_tongji.huanle = fish_tongji.huanle + parseInt(markDown.match(/\d+/)[0])
            } else if (markDown.indexOf('嘻嘻 恭喜你获得一个口令红包, 快去聊天室粘贴口令吧~') > -1) {
                fish_tongji.kouling += 1
            } else if (markDown.indexOf('您获得了 ...1 个... 鱼翅. 已到账...[来源: 聊天室游戏-捡鱼叉收获]') > -1) {
                fish_tongji.five2one += 1
                fish_tongji.total += 1
                console.log('五换一')
            } else if (content.match(/您获得了 ...\d+ 个... 鱼翅. 已到账...\[来源: 暴雨梨花针/)) {
                var match = markDown.match(/\d+/);
                match = parseInt(match[0]);
                fish_tongji.total += match
                fish_tongji.yuchi += match
                fish_tongji.byYuchi += match
                /* const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');
                const table = doc.querySelector('table');
                for (let i = 1; i < table.rows.length; i++) {
                    var cells = table.rows[i].cells;
                    fish_tongji.total += parseInt(cells[2].innerText)
                    fish_tongji.yuchi += parseInt(cells[2].innerText)
                    fish_tongji.byYuchi += parseInt(cells[2].innerText)
                }*/
                fish_tongji.byDateStr = new Date().toLocaleString()
            }
            window.localStorage.setItem('fish-tongji', JSON.stringify(fish_tongji))
        } catch (e) {
            console.log(e)
        }
    }


})();
