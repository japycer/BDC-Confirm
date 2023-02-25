-- 一、FDCQ
-- 1、获取需要核查的信息
select FDCQID, RG_FDZL, RG_DJLX, RG_FDCJYJG, RG_FWXZ, RG_QLLX, RG_GHYT, RG_GHYTMC, RG_BDCQZHC, FT_FDZL, FT_DJLX, FT_FDCJYJG, FT_FWXZ, FT_QLLX, FT_GHYT, FT_GHYTMC, FT_BDCQZHC 
from HC_FDCQ2 where
     rownum <=5 and (RG_FDZL = 1 and BZ_FDZL IS NULL or RG_DJLX = 1 and BZ_DJLX IS NULL or RG_FDCJYJG = 1 and BZ_FDCJYJG IS NULL or RG_FWXZ = 1 and BZ_FWXZ IS NULL or RG_QLLX = 1 and BZ_QLLX IS NULL or RG_GHYT = 1 and BZ_GHYT IS NULL or RG_GHYTMC = 1 and BZ_GHYTMC IS NULL or RG_BDCQZHC = 1 and BZ_BDCQZHC IS NULL) and USE_FDZL <> 1 and USE_DJLX <> 1 and USE_FDCJYJG <> 1 and USE_FWXZ <> 1 and USE_QLLX <> 1 and USE_GHYT <> 1 and USE_GHYTMC <> 1 and USE_BDCQZHC <> 1

-- 2、将这些记录设置为正在使用
update HC_FDCQ2 set USE_FDZL=1, USE_DJLX=1, USE_FWXZ=1, USE_QLLX=1, USE_GHYT=1, USE_GHYTMC=1, USE_BDCQZHC=1 where FDCQID IN
('102814CQN_5408436984289FWN_11.001', '118558CQN_0158218650613FWN_11.002', '122309CQN_5157157983631FWN_11.001', '133170CQN_3566976441070FWN_11.001', '159374CQN_0112952941563FWN_11.001');
commit;

-- 3、获取表的全部信息
select * from cy_fdcq2_1987 where FDCQID = '102814CQN_5408436984289FWN_11.001'

-- 4、获取相关表的信息
-- 4.1 H
select b.* from cy_fdcq2_1987 a, cy_h_1987 b where a.FDCQID = '102814CQN_5408436984289FWN_11.001' and b.hid = a.bdcdyid
-- 4.2 ZRZ
select b.* from cy_fdcq2_1987 a, cy_zrz_1987 b where a.FDCQID = '102814CQN_5408436984289FWN_11.001' and b.zrzid = a.zrzid
-- 4.3 zdjbxx
select b.* from cy_fdcq2_1987 a, cy_zdjbxx_1987 b where a.FDCQID = '102814CQN_5408436984289FWN_11.001' and b.zdid = a.zdid

-- 5 提交更改
update HC_FDCQ2 set BZ_FDZL='正确', BZ_DJLX='正确', BZ_FWXZ='正确' where FDCQID = '102814CQN_5408436984289FWN_11.001';
commit;

select t.* from cy_zrz_1987 t where t.zrzid IN (select a.zrzid from cy_fdcq2_1987 a, cy_h_1987 b where a.FDCQID = '102814CQN_5408436984289FWN_11.001' and b.hid = a.bdcdyid and rownum <=1)


-- 二、QLR
-- 1、获取需要核查的信息
select QLRID, RG_QLRLX, RG_ZJZL, RG_QLRMC, RG_ZJH, FT_QLRLX, FT_ZJZL, FT_QLRMC, FT_ZJH
from HC_QLR where
     rownum <=5 and (RG_QLRLX = 1 and BZ_QLRLX IS NULL or RG_ZJZL = 1 and BZ_ZJZL IS NULL or RG_QLRMC = 1 and BZ_QLRMC IS NULL or RG_ZJH = 1 and BZ_ZJH IS NULL) and USE_QLRLX <> 1 and USE_ZJZL <> 1 and USE_QLRMC <> 1 and USE_ZJH <> 1

-- 2、将这些记录设置为正在使用
update HC_QLR set USE_QLRLX=1, USE_ZJZL=1, USE_QLRMC=1, USE_ZJH=1 where QLRID IN
('102814CQN_5408436984289FWN_11.001', '118558CQN_0158218650613FWN_11.002');
commit;

-- 3、获取表的全部信息
select * from cy_fdcq2_1987 where FDCQID = '102814CQN_5408436984289FWN_11.001'

-- 4、提交更改
update HC_QLR set BZ_QLRLX='正确', BZ_ZJZL='正确', BZ_QLRMC='正确' where QLRID = '102814CQN_5408436984289FWN_11.001';
commit;