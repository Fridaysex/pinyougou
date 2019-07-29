package com.pinyougou.page.service.impl;

import com.pinyougou.page.service.ItemPageService;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;


public class pageDeleteListener implements MessageListener{


    private ItemPageService itemPageService;
    @Override
    public void onMessage(Message message) {
        ObjectMessage objectMessage = (ObjectMessage) message;
        try {
            Long[] goodsIds = (Long[]) objectMessage.getObject();
            boolean b = itemPageService.deleteItemHtml(goodsIds);
            System.out.println("网页删结果:"+b);
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
