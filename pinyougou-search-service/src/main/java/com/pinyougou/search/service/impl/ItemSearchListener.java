package com.pinyougou.search.service.impl;

import com.alibaba.fastjson.JSON;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jms.*;
import java.util.List;
import java.util.Map;

public class ItemSearchListener implements MessageListener {

    @Autowired
    private ItemSearchService itemSearchService;


    @Override
    public void onMessage(Message message) {
        System.out.println("监听接收到消息...");
        try {
            TextMessage textMessage = (TextMessage) message;
            String text = textMessage.getText();
            List<TbItem> itemList = JSON.parseArray(text, TbItem.class);
            for (TbItem item : itemList) {
                System.out.println(item.getId()+""+item.getTitle());
                //将spec字段中的json字符串转换为map
                Map specMap = JSON.parseObject(item.getSpec());
                //给带solr朱姐的字段赋值
                item.setSpecMap(specMap);
            }
            //向solr中导入数据
            itemSearchService.importList(itemList);
            System.out.println("成功导入到索引库");
        } catch (JMSException e) {
            e.printStackTrace();

        }
    }




}
