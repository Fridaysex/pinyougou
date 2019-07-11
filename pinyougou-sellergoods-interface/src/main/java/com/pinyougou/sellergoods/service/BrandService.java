package com.pinyougou.sellergoods.service;

import java.util.List;
import java.util.Map;

import com.pinyougou.pojo.TbBrand;

import entity.PageResult;
import entity.Result;

/**
 * 品牌接口
 * @author Administrator
 *
 */
public interface BrandService {

	/**
	 * 查询所有
	 * @return
	 */
	public List<TbBrand> findAll();
	
	/**
	 * 分页查询
	 * @param pageNum
	 * @param pageSize
	 * @return
	 */
	public PageResult findPage(int pageNum,int pageSize);
	
	/**
	 * 添加品牌
	 * @return
	 */
	public void add(TbBrand tbBrand);
	
	/**
	 * 修改品牌
	 * @param tbBrand
	 */
	public void update(TbBrand tbBrand);
	
	/**
	 * 通过ID查询TbBrand
	 * @param tbBrand
	 * @return
	 */
	public TbBrand findOne(Long id);
	
	/**
	 * 通过ID数组删除多个对象
	 * @param id
	 * @return
	 */
	public void  delete(Long[] ids);
	
	/**
	   * 条件查询
	 * @param tbBrand
	 * @param pageNum
	 * @param pageSize
	 * @return
	 */
	public PageResult findPage(TbBrand tbBrand ,int pageNum,int pageSize);


	/**
	 * 关联品牌下拉数据
	 * @return
	 */
	List<Map> selectOptionList();

	
		
	
	
}
