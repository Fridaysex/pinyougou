package com.pinyougou.search.service;

import java.util.List;
import java.util.Map;

public interface ItemSearchService {

    /**
     * 根据searchMap完成搜索
     * @param search
     * @return
     */
    public Map<String,Object> search(Map search);


    /**
     * 导入sku数据
     * @param list
     */
    public void importList(List list);

    /**
     * 根据商品ids批量删除索引
     * @param goodsIdList
     */
    public void deleteByGoodsIds(List goodsIdList);
}
