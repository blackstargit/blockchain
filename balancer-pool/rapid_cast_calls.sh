#!/bin/bash


# Disable automining so transactions are queued instead of mined immediately.
# cast rpc anvil_setAutomine false

#  cast send 0xBA12222222228d8Ba445958A75a0704d566BF2C8  \
#     "swap((bytes32,uint8,address,address,uint256,bytes),(address,bool,address,bool),uint256,uint256)" \
#     "(0x00eba51a44c235bf4f0d3575d6c99d3d4236f694000000000000000000000182,0,0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20,0x9D6664Ad3bbEf76a2A0DF759DaDBF29D8c8D54E2,100,0x)" \
#     "(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,false,0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,false)" \
#     0 $(($(date +%s) + 600)) \
#     --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 

    nonce=$(cast nonce 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266)
    # nonce=$(($nonce + 1))
    echo "Nonce: $nonce"

for i in {1..99}; 
do
  echo "Transaction #$i Started"
  nonce=$(($nonce + 1))

  cast send 0xBA12222222228d8Ba445958A75a0704d566BF2C8 \
    "swap((bytes32,uint8,address,address,uint256,bytes),(address,bool,address,bool),uint256,uint256)" \
    "(0x00eba51a44c235bf4f0d3575d6c99d3d4236f694000000000000000000000182,0,0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20,0x9D6664Ad3bbEf76a2A0DF759DaDBF29D8c8D54E2,100,0x)" \
    "(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,false,0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,false)" \
    0 $(($(date +%s) + 600)) \
    --nonce $nonce \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 &
  
  echo "Transaction #$i submitted"
done

# cast rpc anvil_mine
# cast rpc anvil_setAutomine true

# # get block
#  cast block 7675288

# # get pending transactions
#  cast rpc txpool_status

# get receipt
# cast receipt 0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20