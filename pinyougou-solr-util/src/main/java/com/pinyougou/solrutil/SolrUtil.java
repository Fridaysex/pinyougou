package com.pinyougou.solrutil;


import com.alibaba.fastjson.JSON;
import com.pinyougou.mapper.TbItemMapper;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.pojo.TbItemExample;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;



/**
 * 实现已审核商品的数据查询
 */
@Component
public class SolrUtil {


    @Autowired
    private TbItemMapper itemMapper;

    public void importItemData(){
        TbItemExample example = new TbItemExample();
        example.createCriteria().andStatusEqualTo("1");//审核通过菜倒入
        List<TbItem> itemList = itemMapper.selectByExample(example);
        System.out.println("--商品列表--");
        for (TbItem item : itemList) {
            System.out.println(item.getId()+""+item.getTitle()+""+item.getPrice());
            //从数据库中提取规格的json字符串转换为map对象
            Map specMap = JSON.parseObject(item.getSpec(),Map.class);

        }
        System.out.println("结束");

    }

    public static void main(String[] args) {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("classpath*:spring/applicationContext-solr.xml");
        SolrUtil solrUtil = (SolrUtil) context.getBean("SolrUtil");
        solrUtil.importItemData();
    }
}
