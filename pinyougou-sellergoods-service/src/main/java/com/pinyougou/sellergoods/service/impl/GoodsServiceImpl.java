package com.pinyougou.sellergoods.service.impl;
import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.pinyougou.mapper.*;
import com.pinyougou.pojo.*;
import com.pinyougou.pojogroup.Goods;
import org.springframework.beans.factory.annotation.Autowired;
import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.pojo.TbGoodsExample.Criteria;
import com.pinyougou.sellergoods.service.GoodsService;

import entity.PageResult;
import org.springframework.transaction.annotation.Transactional;

/**
 * 服务实现层
 * @author Administrator
 *
 */

@Transactional
@Service
public class GoodsServiceImpl implements GoodsService {

	@Autowired
	private TbGoodsMapper goodsMapper;

	@Autowired
	private TbGoodsDescMapper goodsDescMapper;

	@Autowired
	private TbItemMapper itemMapper;

	@Autowired
	private TbBrandMapper brandMapper;

	@Autowired
	private TbItemCatMapper itemCatMapper;

	@Autowired
	private TbSellerMapper sellerMapper;
	
	/**
	 * 查询全部
	 */
	@Override
	public List<TbGoods> findAll() {
		return goodsMapper.selectByExample(null);
	}

	/**
	 * 按分页查询
	 */
	@Override
	public PageResult findPage(int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);		
		Page<TbGoods> page=   (Page<TbGoods>) goodsMapper.selectByExample(null);
		return new PageResult(page.getTotal(), page.getResult());
	}


	/**
	 * 增加
	 * @param goods
	 */

	@Override
	public void add(Goods goods) {
		//设置未申请状态
		goods.getGoods().setAuditStatus("0");

		goodsMapper.insert(goods.getGoods());
		//商品描述设置id
		goods.getGoodsDesc().setGoodsId(goods.getGoods().getId());
		//插入商品扩展数据
		goodsDescMapper.insert(goods.getGoodsDesc());
		if ("1".equals(goods.getGoods().getIsEnableSpec())){
			for (TbItem item : goods.getItemList()) {
				//标题
				String title = goods.getGoods().getGoodsName();
				Map<String,Object> specMap = JSON.parseObject(item.getSpec());
				for (String key : specMap.keySet()) {
					title+=""+specMap.get(key);
				}
				item.setTitle(title);
				setItemValus(goods,item);
				System.out.println("设置了规格");

			}
		}else {
			TbItem item=new TbItem();
			item.setTitle(goods.getGoods().getGoodsName());//商品 KPU+规格描述串作为SKU 名称
			item.setPrice( goods.getGoods().getPrice() );//价格
			item.setStatus("1");//状态
			item.setIsDefault("1");//是否默认
			item.setNum(99999);//库存数量
			item.setSpec("{}");
			setItemValus(goods,item);
			itemMapper.insert(item);
			System.out.println("未设置规格");

		}

	}
	private void setItemValus(Goods goods,TbItem item){
		item.setGoodsId(goods.getGoods().getId());//商品 SPU 编号
		item.setSellerId(goods.getGoods().getSellerId());//商家编号
		item.setCategoryid(goods.getGoods().getCategory3Id());//商品分类编号（3 级）
		item.setCreateTime(new Date());//创建日期
		item.setUpdateTime(new Date());//修改日期
		//品牌名称
		TbBrand brand =	brandMapper.selectByPrimaryKey(goods.getGoods().getBrandId());
		item.setBrand(brand.getName());
		//分类名称
		TbItemCat itemCat =itemCatMapper.selectByPrimaryKey(goods.getGoods().getCategory3Id());
		item.setCategory(itemCat.getName());

		//商家名称
		TbSeller seller =sellerMapper.selectByPrimaryKey(goods.getGoods().getSellerId());
		item.setSeller(seller.getNickName());

		//图片地址（取 spu 的第一个图片）
		List<Map> imageList = JSON.parseArray(goods.getGoodsDesc().getItemImages(),Map.class) ;
		if(imageList.size()>0){
			item.setImage ( (String)imageList.get(0).get("url"));

		}

	}

	/**
	 * 修改
	 */
	@Override
	public void update(Goods goods){
		//设置未申请状态:如果是经过修改的商品,需要重新设置状态
		goods.getGoods().setAuditStatus("0");
		goodsMapper.updateByPrimaryKey(goods.getGoods());//保存商品表
		goodsDescMapper.updateByPrimaryKey(goods.getGoodsDesc());//保存商品扩展表
		//删除原有的sku列表数据
		TbItemExample example = new TbItemExample();
		example.createCriteria().andGoodsIdEqualTo(goods.getGoods().getId());
		itemMapper.deleteByExample(example);
		//插入新的sku列表数据
		saveItemList(goods);

	}	
	private void saveItemList(Goods goods){
		if ("1".equals(goods.getGoods().getIsEnableSpec())){
			for (TbItem item : goods.getItemList()) {
				//标题
				String title = goods.getGoods().getGoodsName();
				Map<String, Object> specMap = JSON.parseObject(item.getSpec());
				for (String key : specMap.keySet()) {
					title += "" + specMap.get(key);
				}
				item.setTitle(title);
				setItemValus(goods, item);
			}
		}else {
			TbItem item=new TbItem();
			item.setTitle(goods.getGoods().getGoodsName());//商品 KPU+规格描述串作为SKU 名称
			item.setPrice( goods.getGoods().getPrice() );//价格
			item.setStatus("1");//状态
			item.setIsDefault("1");//是否默认
			item.setNum(99999);//库存数量
			item.setSpec("{}");
			setItemValus(goods,item);
			itemMapper.insert(item);
		}
	}


	/**
	 * 根据ID获取实体
	 * @param id
	 * @return
	 */
	@Override
	public Goods findOne(Long id){
		Goods goods = new Goods();
		TbGoods tbGoods = goodsMapper.selectByPrimaryKey(id);
		goods.setGoods(tbGoods);
		TbGoodsDesc tbGoodsDesc = goodsDescMapper.selectByPrimaryKey(id);
		goods.setGoodsDesc(tbGoodsDesc);
		//查询sku商品列表
		TbItemExample example = new TbItemExample();
		example.createCriteria().andGoodsIdEqualTo(id);
		List<TbItem> items = itemMapper.selectByExample(example);
		goods.setItemList(items);
		return goods;

	}

	/**
	 * 批量删除
	 */
	@Override
	public void delete(Long[] ids) {
		for(Long id:ids){
			TbGoods goods = goodsMapper.selectByPrimaryKey(id);
			goods.setIsDelete("1");
			goodsMapper.updateByPrimaryKey(goods);
		}		
	}


	/**
	 * 分页查询
	 * @param goods
	 * @param pageNum 当前页 码
	 * @param pageSize 每页记录数
	 * @return
	 */
	@Override
	public PageResult findPage(TbGoods goods, int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);
		
		TbGoodsExample example=new TbGoodsExample();
		Criteria criteria = example.createCriteria();
		criteria.andIsDeleteIsNull();//添加条件查询非删除状态goods
		
		if(goods!=null){			
			if(goods.getSellerId()!=null && goods.getSellerId().length()>0){
				criteria.andSellerIdEqualTo(goods.getSellerId());
			}
			if(goods.getGoodsName()!=null && goods.getGoodsName().length()>0){
				criteria.andGoodsNameLike("%"+goods.getGoodsName()+"%");
			}
			if(goods.getAuditStatus()!=null && goods.getAuditStatus().length()>0){
				criteria.andAuditStatusLike("%"+goods.getAuditStatus()+"%");
			}
			if(goods.getIsMarketable()!=null && goods.getIsMarketable().length()>0){
				criteria.andIsMarketableLike("%"+goods.getIsMarketable()+"%");
			}
			if(goods.getCaption()!=null && goods.getCaption().length()>0){
				criteria.andCaptionLike("%"+goods.getCaption()+"%");
			}
			if(goods.getSmallPic()!=null && goods.getSmallPic().length()>0){
				criteria.andSmallPicLike("%"+goods.getSmallPic()+"%");
			}
			if(goods.getIsEnableSpec()!=null && goods.getIsEnableSpec().length()>0){
				criteria.andIsEnableSpecLike("%"+goods.getIsEnableSpec()+"%");
			}
			if(goods.getIsDelete()!=null && goods.getIsDelete().length()>0){
				criteria.andIsDeleteLike("%"+goods.getIsDelete()+"%");
			}
	
		}
		
		Page<TbGoods> page= (Page<TbGoods>)goodsMapper.selectByExample(example);		
		return new PageResult(page.getTotal(), page.getResult());
	}

	/**
	 * 批量审核商家商品更改商品审核状态
	 */
	@Override
	public void updateStatus(Long[] ids,String status) {
		for (Long id : ids) {
			TbGoods goods = goodsMapper.selectByPrimaryKey(id);
			goods.setAuditStatus(status);
			goodsMapper.updateByPrimaryKey(goods);
		}
	}

	/**
	 * 更新商品是否在售信息
	 * @param ids
	 * @param status
	 */
	@Override
	public void updateMarketTable(Long[] ids, String status) {
		for (Long id : ids) {
			TbGoods goods = goodsMapper.selectByPrimaryKey(id);
			goods.setIsMarketable(status);
			goodsMapper.updateByPrimaryKey(goods);
		}
	}


	/**
	 * 根据商品id和审核状态查询item表信息
	 * @param goodsIds
	 * @param status
	 * @return
	 */
	@Override
	public List<TbItem> findItemListByGoodsIdandStatus(Long[] goodsIds, String status) {
		TbItemExample example = new TbItemExample();
		TbItemExample.Criteria criteria = example.createCriteria();
		criteria.andStatusEqualTo("1").andGoodsIdIn(Arrays.asList(goodsIds));
		return itemMapper.selectByExample(example);
	}

}
