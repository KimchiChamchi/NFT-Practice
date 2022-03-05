// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./SaleAnimalToken.sol";

contract MintAnimalToken is ERC721Enumerable {
    // ERC721에서 (name, sybol)이 필요
    constructor() ERC721("zoozooClub", "SM") {}

    SaleAnimalToken public saleAnimalToken;

    // 토큰id로부터 동물타입을 담을 매핑
    mapping(uint256 => uint256) public animalTypes;

    struct AnimalTokenData {
        uint256 animalTokenId;
        uint256 animalType;
        uint256 animalPrice;
    }

    function mintAnimalToken() public {
        // totalSupply() : ERC721Enumerable.sol에서 제공. 지금까지 민팅 된 NFT양을 의미(각 NFT를 구별할 id값)
        uint256 animalTokenId = totalSupply() + 1;

        // 동물 타입
        uint256 animalType = (uint256(
            keccak256( // 변하는 값(현재시간, 사용자, 토큰아이디값)을 넣어 랜덤 수를 뽑아냄
                abi.encodePacked(block.timestamp, msg.sender, animalTokenId)
            ) // 랜덤 수를 5로 나눈 나머지로 1~5까지의 값을 추출(동물타입은 5가지가 됨)
        ) % 5) + 1;

        // 이번에 만들 토큰id에 동물타입(1~5)를 저장
        animalTypes[animalTokenId] = animalType;

        // 토큰 민팅하는 함수(사용자 본인address와 토큰id가 들어감)
        _mint(msg.sender, animalTokenId);
    }

    function getAnimalTokens(address _animalTokenOwner)
        public
        view
        returns (AnimalTokenData[] memory)
    {
        // 배열[]과 문자열string은 memory를 써줘야함
        uint256 balanceLength = balanceOf(_animalTokenOwner);
        require(balanceLength != 0, "Owner did not have token.");
        // AnimalTokenData구조체를 담을 변수 생성
        // 배열의 길이는 토큰의 개수만큼(balanceLength)
        AnimalTokenData[] memory animalTokenData = new AnimalTokenData[](
            balanceLength
        );
        for (uint256 i = 0; i < balanceLength; i++) {
            uint256 animalTokenId = tokenOfOwnerByIndex(_animalTokenOwner, i);
            uint256 animalType = animalTypes[animalTokenId];
            uint256 animalPrice = saleAnimalToken.getAnimalTokenPrice(
                animalTokenId
            );
            animalTokenData[i] = AnimalTokenData(
                animalTokenId,
                animalType,
                animalPrice
            );
        }
        return animalTokenData;
    }

    function setSaleAnimalToken(address _saleAnimalToken) public {
        saleAnimalToken = SaleAnimalToken(_saleAnimalToken);
    }
}
