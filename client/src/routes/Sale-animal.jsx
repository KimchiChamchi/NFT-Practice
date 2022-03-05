import React, { useEffect, useState } from 'react';
import { Grid } from '@chakra-ui/react';
import SaleAnimalCard from '../components/SaleAnimalCard';
import {
  mintAnimalTokenContract,
  saleAnimalTokenContract,
} from '../web3Config';

const SaleAnimal = props => {
  const accounts = props.accounts;
  //
  const [saleAnimalCardArray, setSaleAnimalCardArray] = useState([]);
  // 판매상태의 켜짐/꺼짐을 나타내는 용도의 useState
  const [saleStatus, setSaleStatus] = useState(false);

  // 사용자가 가진 토큰들 불러오기
  const getOnSaleAnimalTokens = async () => {
    try {
      const getOnsaleAnimalTokenArrayLength =
        await saleAnimalTokenContract.methods
          .getOnsaleAnimalTokenArrayLength()
          .call();

      const tempOnSaleArray = [];
      for (let i = 0; i < parseInt(getOnsaleAnimalTokenArrayLength, 10); i++) {
        const animalTokenId = await saleAnimalTokenContract.methods
          .onSaleAnimalTokenArray(i)
          .call();
        const animalType = await mintAnimalTokenContract.methods
          .animalTypes(animalTokenId)
          .call();
        const animalTokenPrice = await saleAnimalTokenContract.methods
          .animalTokenPrices(animalTokenId)
          .call();

        tempOnSaleArray.push({
          animalTokenId: animalTokenId,
          animalType: animalType,
          animalTokenPrice: animalTokenPrice,
        });
      }
      setSaleAnimalCardArray(tempOnSaleArray);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getOnSaleAnimalTokens();
  }, [mintAnimalTokenContract, saleAnimalTokenContract]);

  // useEffect(async () => {
  //   if (!accounts || !mintAnimalTokenContract || !saleAnimalTokenContract)
  //     return; // 계정이 없을 경우(로그인 안 됐을 경우) 실행되지 않게하기
  //   getIsApprovedForAll();
  //   getAnimalTokens(); // 해당 계정의 토큰들 불러오기
  // }, [accounts, mintAnimalTokenContract, saleAnimalTokenContract]);
  // useEffect(() => {
  //   console.log(animalCardArray);
  // }, [animalCardArray]);

  return (
    <>
      <Grid templateColumns="repeat(4,1fr)" gap={8} mt={4}>
        {saleAnimalCardArray &&
          saleAnimalCardArray.map((v, index) => {
            return (
              <SaleAnimalCard
                key={index}
                animalTokenId={v.animalTokenId}
                animalType={v.animalType}
                animalTokenPrice={v.animalTokenPrice}
                accounts={accounts}
                getOnSaleAnimalTokens={getOnSaleAnimalTokens}
              />
            );
          })}
      </Grid>
    </>
  );
};

export default SaleAnimal;
