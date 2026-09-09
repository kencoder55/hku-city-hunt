"use client";
import AuthContainer from "@/components/common/AuthContainer";
import HeaderBanner from "@/components/common/HeaderBanner";
import StampCard from "@/components/reward/StampCard";
import { MemberRewardApi } from "@/data/MemberRewardApi";
import { ProductApi } from "@/data/ProductApi";
import { RedemptionRecordApi } from "@/data/RedemptionRecordApi";
import { useAppSelector } from "@/lib/hooks";
import { CondOperator } from "@dataui/crud-request";
import { Box, Button, Container, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export default function Rewards() {
  const [productList, setProductList] = useState([]);
  const [memberRewardList, setMemberRewardList] = useState([]);
  const [redemptionRecordList, setRedemptionRecordList] = useState([]);
  const t = useTranslations();
  const locale = useLocale();
  const user = useAppSelector(state => state.user);
  const viewRef = useRef(null);

  useEffect(() => {
    fetchProductList();
  }, []);

  useEffect(() => {
    if (!user || !user.id) {
      setMemberRewardList([]);
      setRedemptionRecordList([]);
      return;
    }

    fetchMemberRewardList();
    fetchRedemptionRecordList();
  }, [user]);

  const fetchProductList = async () => {
    try {
      const response = await ProductApi.list(1, null, [], locale);
      console.log("Product list response:", response);
      // sort by required_rewards ascending
      response.data.sort((a, b) => a.requiredRewards - b.requiredRewards);
      setProductList(response.data);
    } catch (error) {
      console.error("Failed to fetch product list:", error);
    }
  };

  const fetchMemberRewardList = async () => {
    try {
      console.log("Fetching member reward list for user:", user);
      const response = await MemberRewardApi.list(1, null, [
        {
          field: "member_id",
          operator: CondOperator.EQUALS,
          value: user.id,
        },
      ]);
      console.log("Member reward list response:", response);
      setMemberRewardList(response.data || []);
    } catch (error) {
      console.error("Failed to fetch member reward list:", error);
    }
  };

  const fetchRedemptionRecordList = async () => {
    try {
      console.log("Fetching redemption record list for user:", user);
      const response = await RedemptionRecordApi.list(1, null, [
        {
          field: "member_id",
          operator: CondOperator.EQUALS,
          value: user.id,
        },
      ]);
      console.log("Redemption record list response:", response);
      setRedemptionRecordList(response.data || []);
    } catch (error) {
      console.error("Failed to fetch redemption record list:", error);
    }
  };

  return (
    <AuthContainer>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          height: "100%",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <HeaderBanner
            title={t("rewards.page_title")}
            leftIcon="/assets/icons/dr-dayday.png"
            rightIcon="/assets/icons/trophy.svg"
            backgroundColor="#a3a1ea"
            fullWidth={false}
          />
        </Box>

        <Box
          ref={viewRef}
          component={"img"}
          src="/assets/images/task-progress.png?v=2"
          alt="Stamp Card Background"
          sx={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <StampCard
            viewRef={viewRef}
            productList={productList}
            memberRewardList={memberRewardList}
            redemptionRecordList={redemptionRecordList}
          />
        </Box>
      </Container>
    </AuthContainer>
  );
}
