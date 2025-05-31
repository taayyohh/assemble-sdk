import { baseSepolia, base, sepolia, mainnet } from 'viem/chains';

var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/constants/abi.json
var require_abi = __commonJS({
  "src/constants/abi.json"(exports, module) {
    module.exports = [
      {
        type: "constructor",
        inputs: [
          {
            name: "_feeTo",
            type: "address",
            internalType: "address"
          }
        ],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "MAX_PAYMENT_SPLITS",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "MAX_PLATFORM_FEE",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "MAX_PROTOCOL_FEE",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "MAX_TICKET_QUANTITY",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "REFUND_CLAIM_DEADLINE",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "addFriend",
        inputs: [
          {
            name: "friend",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "allowance",
        inputs: [
          {
            name: "",
            type: "address",
            internalType: "address"
          },
          {
            name: "",
            type: "address",
            internalType: "address"
          },
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "approve",
        inputs: [
          {
            name: "spender",
            type: "address",
            internalType: "address"
          },
          {
            name: "id",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "amount",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "balanceOf",
        inputs: [
          {
            name: "",
            type: "address",
            internalType: "address"
          },
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "banUser",
        inputs: [
          {
            name: "user",
            type: "address",
            internalType: "address"
          },
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "calculatePrice",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "tierId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "quantity",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "totalPrice",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "cancelEvent",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "checkIn",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "checkInDelegate",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "ticketTokenId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "attendee",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "checkInWithTicket",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "ticketTokenId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "claimFunds",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "claimOrganizerCredential",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "claimTicketRefund",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "claimTipRefund",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "comments",
        inputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "author",
            type: "address",
            internalType: "address"
          },
          {
            name: "timestamp",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "content",
            type: "string",
            internalType: "string"
          },
          {
            name: "parentId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "isDeleted",
            type: "bool",
            internalType: "bool"
          },
          {
            name: "likes",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "createEvent",
        inputs: [
          {
            name: "params",
            type: "tuple",
            internalType: "struct Assemble.EventParams",
            components: [
              {
                name: "title",
                type: "string",
                internalType: "string"
              },
              {
                name: "description",
                type: "string",
                internalType: "string"
              },
              {
                name: "imageUri",
                type: "string",
                internalType: "string"
              },
              {
                name: "startTime",
                type: "uint256",
                internalType: "uint256"
              },
              {
                name: "endTime",
                type: "uint256",
                internalType: "uint256"
              },
              {
                name: "capacity",
                type: "uint256",
                internalType: "uint256"
              },
              {
                name: "venueId",
                type: "uint256",
                internalType: "uint256"
              },
              {
                name: "visibility",
                type: "uint8",
                internalType: "enum Assemble.EventVisibility"
              }
            ]
          },
          {
            name: "tiers",
            type: "tuple[]",
            internalType: "struct Assemble.TicketTier[]",
            components: [
              {
                name: "name",
                type: "string",
                internalType: "string"
              },
              {
                name: "price",
                type: "uint256",
                internalType: "uint256"
              },
              {
                name: "maxSupply",
                type: "uint256",
                internalType: "uint256"
              },
              {
                name: "sold",
                type: "uint256",
                internalType: "uint256"
              },
              {
                name: "startSaleTime",
                type: "uint256",
                internalType: "uint256"
              },
              {
                name: "endSaleTime",
                type: "uint256",
                internalType: "uint256"
              },
              {
                name: "transferrable",
                type: "bool",
                internalType: "bool"
              }
            ]
          },
          {
            name: "splits",
            type: "tuple[]",
            internalType: "struct Assemble.PaymentSplit[]",
            components: [
              {
                name: "recipient",
                type: "address",
                internalType: "address"
              },
              {
                name: "basisPoints",
                type: "uint256",
                internalType: "uint256"
              }
            ]
          }
        ],
        outputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "deleteComment",
        inputs: [
          {
            name: "commentId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "eventCancelled",
        inputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "eventInvites",
        inputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "eventOrganizers",
        inputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "",
            type: "address",
            internalType: "address"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "events",
        inputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "basePrice",
            type: "uint128",
            internalType: "uint128"
          },
          {
            name: "startTime",
            type: "uint64",
            internalType: "uint64"
          },
          {
            name: "capacity",
            type: "uint32",
            internalType: "uint32"
          },
          {
            name: "venueId",
            type: "uint16",
            internalType: "uint16"
          },
          {
            name: "visibility",
            type: "uint8",
            internalType: "uint8"
          },
          {
            name: "status",
            type: "uint8",
            internalType: "uint8"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "feeTo",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "address",
            internalType: "address"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "generateTokenId",
        inputs: [
          {
            name: "tokenType",
            type: "uint8",
            internalType: "enum Assemble.TokenType"
          },
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "tierId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "serialNumber",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "pure"
      },
      {
        type: "function",
        name: "getComment",
        inputs: [
          {
            name: "commentId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "",
            type: "tuple",
            internalType: "struct CommentLibrary.Comment",
            components: [
              {
                name: "author",
                type: "address",
                internalType: "address"
              },
              {
                name: "timestamp",
                type: "uint256",
                internalType: "uint256"
              },
              {
                name: "content",
                type: "string",
                internalType: "string"
              },
              {
                name: "parentId",
                type: "uint256",
                internalType: "uint256"
              },
              {
                name: "isDeleted",
                type: "bool",
                internalType: "bool"
              },
              {
                name: "likes",
                type: "uint256",
                internalType: "uint256"
              }
            ]
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "getEventComments",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "",
            type: "uint256[]",
            internalType: "uint256[]"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "getFriends",
        inputs: [
          {
            name: "user",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [
          {
            name: "",
            type: "address[]",
            internalType: "address[]"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "getPaymentSplits",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "",
            type: "tuple[]",
            internalType: "struct Assemble.PaymentSplit[]",
            components: [
              {
                name: "recipient",
                type: "address",
                internalType: "address"
              },
              {
                name: "basisPoints",
                type: "uint256",
                internalType: "uint256"
              }
            ]
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "getRefundAmounts",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "user",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [
          {
            name: "ticketRefund",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "tipRefund",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "getUserRSVP",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "user",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [
          {
            name: "",
            type: "uint8",
            internalType: "enum SocialLibrary.RSVPStatus"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "hasAttended",
        inputs: [
          {
            name: "user",
            type: "address",
            internalType: "address"
          },
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "hasLikedComment",
        inputs: [
          {
            name: "commentId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "user",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "inviteToEvent",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "invitees",
            type: "address[]",
            internalType: "address[]"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "isEventCancelled",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "isFriend",
        inputs: [
          {
            name: "",
            type: "address",
            internalType: "address"
          },
          {
            name: "",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "isInvited",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "user",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [
          {
            name: "invited",
            type: "bool",
            internalType: "bool"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "isOperator",
        inputs: [
          {
            name: "",
            type: "address",
            internalType: "address"
          },
          {
            name: "",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "isValidTicketForEvent",
        inputs: [
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "isValid",
            type: "bool",
            internalType: "bool"
          }
        ],
        stateMutability: "pure"
      },
      {
        type: "function",
        name: "likeComment",
        inputs: [
          {
            name: "commentId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "nextCommentId",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "nextEventId",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "pendingWithdrawals",
        inputs: [
          {
            name: "",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "postComment",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "content",
            type: "string",
            internalType: "string"
          },
          {
            name: "parentId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "protocolFeeBps",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "purchaseTickets",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "tierId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "quantity",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "payable"
      },
      {
        type: "function",
        name: "purchaseTickets",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "tierId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "quantity",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "referrer",
            type: "address",
            internalType: "address"
          },
          {
            name: "platformFeeBps",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "payable"
      },
      {
        type: "function",
        name: "removeFriend",
        inputs: [
          {
            name: "friend",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "removeInvitation",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "invitee",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "rsvps",
        inputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [
          {
            name: "",
            type: "uint8",
            internalType: "enum SocialLibrary.RSVPStatus"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "setFeeTo",
        inputs: [
          {
            name: "newFeeTo",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "setOperator",
        inputs: [
          {
            name: "operator",
            type: "address",
            internalType: "address"
          },
          {
            name: "approved",
            type: "bool",
            internalType: "bool"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "setProtocolFee",
        inputs: [
          {
            name: "newFeeBps",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "ticketTiers",
        inputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "name",
            type: "string",
            internalType: "string"
          },
          {
            name: "price",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "maxSupply",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "sold",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "startSaleTime",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "endSaleTime",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "transferrable",
            type: "bool",
            internalType: "bool"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "tipEvent",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "referrer",
            type: "address",
            internalType: "address"
          },
          {
            name: "platformFeeBps",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "payable"
      },
      {
        type: "function",
        name: "tipEvent",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "payable"
      },
      {
        type: "function",
        name: "totalReferralFees",
        inputs: [
          {
            name: "",
            type: "address",
            internalType: "address"
          }
        ],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "totalSupply",
        inputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "transfer",
        inputs: [
          {
            name: "from",
            type: "address",
            internalType: "address"
          },
          {
            name: "to",
            type: "address",
            internalType: "address"
          },
          {
            name: "id",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "amount",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "unbanUser",
        inputs: [
          {
            name: "user",
            type: "address",
            internalType: "address"
          },
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "unlikeComment",
        inputs: [
          {
            name: "commentId",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "updateRSVP",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "status",
            type: "uint8",
            internalType: "enum SocialLibrary.RSVPStatus"
          }
        ],
        outputs: [],
        stateMutability: "nonpayable"
      },
      {
        type: "function",
        name: "usedTickets",
        inputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "event",
        name: "Approval",
        inputs: [
          {
            name: "owner",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "spender",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "id",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "AttendanceVerified",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "user",
            type: "address",
            indexed: true,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "CommentDeleted",
        inputs: [
          {
            name: "commentId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "deletedBy",
            type: "address",
            indexed: true,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "CommentLiked",
        inputs: [
          {
            name: "commentId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "user",
            type: "address",
            indexed: true,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "CommentPosted",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "commentId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "author",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "parentId",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "CommentUnliked",
        inputs: [
          {
            name: "commentId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "user",
            type: "address",
            indexed: true,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "EventCancelled",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "organizer",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "timestamp",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "EventCreated",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "organizer",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "startTime",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "EventTipped",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "tipper",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "FeeToUpdated",
        inputs: [
          {
            name: "oldFeeTo",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "newFeeTo",
            type: "address",
            indexed: true,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "FriendAdded",
        inputs: [
          {
            name: "user1",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "user2",
            type: "address",
            indexed: true,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "FriendRemoved",
        inputs: [
          {
            name: "user1",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "user2",
            type: "address",
            indexed: true,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "FundsClaimed",
        inputs: [
          {
            name: "recipient",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "InvitationRevoked",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "invitee",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "organizer",
            type: "address",
            indexed: true,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "OperatorSet",
        inputs: [
          {
            name: "owner",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "operator",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "approved",
            type: "bool",
            indexed: false,
            internalType: "bool"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "PaymentAllocated",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "recipient",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          },
          {
            name: "role",
            type: "string",
            indexed: false,
            internalType: "string"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "PlatformFeeAllocated",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "referrer",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          },
          {
            name: "feeBps",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "ProtocolFeeUpdated",
        inputs: [
          {
            name: "oldFee",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          },
          {
            name: "newFee",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "RSVPUpdated",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "user",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "status",
            type: "uint8",
            indexed: false,
            internalType: "enum SocialLibrary.RSVPStatus"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "RefundClaimed",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "user",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          },
          {
            name: "refundType",
            type: "string",
            indexed: false,
            internalType: "string"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "TicketPurchased",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "buyer",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "quantity",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          },
          {
            name: "price",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "TicketUsed",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "user",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "ticketTokenId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "tierId",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "Transfer",
        inputs: [
          {
            name: "caller",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "from",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "to",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "id",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          },
          {
            name: "amount",
            type: "uint256",
            indexed: false,
            internalType: "uint256"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "UserBanned",
        inputs: [
          {
            name: "user",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "bannedBy",
            type: "address",
            indexed: true,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "UserInvited",
        inputs: [
          {
            name: "eventId",
            type: "uint256",
            indexed: true,
            internalType: "uint256"
          },
          {
            name: "invitee",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "organizer",
            type: "address",
            indexed: true,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "event",
        name: "UserUnbanned",
        inputs: [
          {
            name: "user",
            type: "address",
            indexed: true,
            internalType: "address"
          },
          {
            name: "unbannedBy",
            type: "address",
            indexed: true,
            internalType: "address"
          }
        ],
        anonymous: false
      },
      {
        type: "error",
        name: "AlreadyBan",
        inputs: []
      },
      {
        type: "error",
        name: "AlreadyFriends",
        inputs: []
      },
      {
        type: "error",
        name: "AlreadyInvited",
        inputs: []
      },
      {
        type: "error",
        name: "AlreadyLiked",
        inputs: []
      },
      {
        type: "error",
        name: "BadAddr",
        inputs: []
      },
      {
        type: "error",
        name: "BadBps",
        inputs: []
      },
      {
        type: "error",
        name: "BadCap",
        inputs: []
      },
      {
        type: "error",
        name: "BadContent",
        inputs: []
      },
      {
        type: "error",
        name: "BadEndTime",
        inputs: []
      },
      {
        type: "error",
        name: "BadFeeTo",
        inputs: []
      },
      {
        type: "error",
        name: "BadQty",
        inputs: []
      },
      {
        type: "error",
        name: "BadRecipient",
        inputs: []
      },
      {
        type: "error",
        name: "BadRef",
        inputs: []
      },
      {
        type: "error",
        name: "BadSaleTimes",
        inputs: []
      },
      {
        type: "error",
        name: "BadTime",
        inputs: []
      },
      {
        type: "error",
        name: "BadTotal",
        inputs: []
      },
      {
        type: "error",
        name: "Banned",
        inputs: []
      },
      {
        type: "error",
        name: "Cancelled",
        inputs: []
      },
      {
        type: "error",
        name: "CantAddSelf",
        inputs: []
      },
      {
        type: "error",
        name: "Ended",
        inputs: []
      },
      {
        type: "error",
        name: "EventOver",
        inputs: []
      },
      {
        type: "error",
        name: "Expired",
        inputs: []
      },
      {
        type: "error",
        name: "FeeHigh",
        inputs: []
      },
      {
        type: "error",
        name: "NeedMore",
        inputs: []
      },
      {
        type: "error",
        name: "NeedValue",
        inputs: []
      },
      {
        type: "error",
        name: "NoComment",
        inputs: []
      },
      {
        type: "error",
        name: "NoEvent",
        inputs: []
      },
      {
        type: "error",
        name: "NoFunds",
        inputs: []
      },
      {
        type: "error",
        name: "NoParent",
        inputs: []
      },
      {
        type: "error",
        name: "NoPerms",
        inputs: []
      },
      {
        type: "error",
        name: "NoRefund",
        inputs: []
      },
      {
        type: "error",
        name: "NoSpace",
        inputs: []
      },
      {
        type: "error",
        name: "NoSplits",
        inputs: []
      },
      {
        type: "error",
        name: "NoSupply",
        inputs: []
      },
      {
        type: "error",
        name: "NoTicket",
        inputs: []
      },
      {
        type: "error",
        name: "NoTier",
        inputs: []
      },
      {
        type: "error",
        name: "NoTiers",
        inputs: []
      },
      {
        type: "error",
        name: "NotActive",
        inputs: []
      },
      {
        type: "error",
        name: "NotAuth",
        inputs: []
      },
      {
        type: "error",
        name: "NotBan",
        inputs: []
      },
      {
        type: "error",
        name: "NotCancelled",
        inputs: []
      },
      {
        type: "error",
        name: "NotDone",
        inputs: []
      },
      {
        type: "error",
        name: "NotEventTime",
        inputs: []
      },
      {
        type: "error",
        name: "NotExpired",
        inputs: []
      },
      {
        type: "error",
        name: "NotFriends",
        inputs: []
      },
      {
        type: "error",
        name: "NotInvited",
        inputs: []
      },
      {
        type: "error",
        name: "NotLiked",
        inputs: []
      },
      {
        type: "error",
        name: "NotOrganizer",
        inputs: []
      },
      {
        type: "error",
        name: "NotPrivate",
        inputs: []
      },
      {
        type: "error",
        name: "NotStarted",
        inputs: []
      },
      {
        type: "error",
        name: "ParentDel",
        inputs: []
      },
      {
        type: "error",
        name: "PlatformHigh",
        inputs: []
      },
      {
        type: "error",
        name: "RefundFail",
        inputs: []
      },
      {
        type: "error",
        name: "Soulbound",
        inputs: []
      },
      {
        type: "error",
        name: "Started",
        inputs: []
      },
      {
        type: "error",
        name: "TooMany",
        inputs: []
      },
      {
        type: "error",
        name: "TransferFail",
        inputs: []
      },
      {
        type: "error",
        name: "Used",
        inputs: []
      },
      {
        type: "error",
        name: "WrongEvent",
        inputs: []
      },
      {
        type: "error",
        name: "WrongOrg",
        inputs: []
      }
    ];
  }
});

// src/types/index.ts
var EventVisibility = /* @__PURE__ */ ((EventVisibility2) => {
  EventVisibility2[EventVisibility2["PUBLIC"] = 0] = "PUBLIC";
  EventVisibility2[EventVisibility2["PRIVATE"] = 1] = "PRIVATE";
  EventVisibility2[EventVisibility2["INVITE_ONLY"] = 2] = "INVITE_ONLY";
  return EventVisibility2;
})(EventVisibility || {});
var RSVPStatus = /* @__PURE__ */ ((RSVPStatus2) => {
  RSVPStatus2[RSVPStatus2["NOT_GOING"] = 0] = "NOT_GOING";
  RSVPStatus2[RSVPStatus2["MAYBE"] = 1] = "MAYBE";
  RSVPStatus2[RSVPStatus2["GOING"] = 2] = "GOING";
  return RSVPStatus2;
})(RSVPStatus || {});
var RefundType = /* @__PURE__ */ ((RefundType2) => {
  RefundType2[RefundType2["TICKET"] = 0] = "TICKET";
  RefundType2[RefundType2["TIP"] = 1] = "TIP";
  return RefundType2;
})(RefundType || {});

// src/errors/index.ts
var AssembleError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "AssembleError";
  }
};
var ContractError = class extends AssembleError {
  constructor(message, contractError) {
    super(message, "CONTRACT_ERROR");
    this.contractError = contractError;
    this.name = "ContractError";
  }
};
var ValidationError = class extends AssembleError {
  constructor(message, field) {
    super(message, "VALIDATION_ERROR");
    this.field = field;
    this.name = "ValidationError";
  }
};
var NetworkError = class extends AssembleError {
  constructor(message, chainId) {
    super(message, "NETWORK_ERROR");
    this.chainId = chainId;
    this.name = "NetworkError";
  }
};
var WalletError = class extends AssembleError {
  constructor(message) {
    super(message, "WALLET_ERROR");
    this.name = "WalletError";
  }
};
function isAssembleError(error) {
  return error instanceof AssembleError;
}
function isContractError(error) {
  return error instanceof ContractError;
}
function isValidationError(error) {
  return error instanceof ValidationError;
}
function isNetworkError(error) {
  return error instanceof NetworkError;
}
function isWalletError(error) {
  return error instanceof WalletError;
}

// src/utils/index.ts
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
function validateAddress(address, fieldName = "address") {
  if (!isValidAddress(address)) {
    throw new ValidationError(`Invalid ${fieldName}: ${address}`, fieldName);
  }
  return address;
}
function toUnixTimestamp(date) {
  return BigInt(Math.floor(date.getTime() / 1e3));
}
function fromUnixTimestamp(timestamp) {
  return new Date(Number(timestamp) * 1e3);
}
function isValidTimestamp(timestamp) {
  const now = BigInt(Math.floor(Date.now() / 1e3));
  return timestamp > 0n && timestamp < now + BigInt(365 * 24 * 60 * 60);
}
function basisPointsToPercent(basisPoints) {
  return basisPoints / 100;
}
function percentToBasisPoints(percent) {
  return Math.round(percent * 100);
}
function validateBasisPoints(basisPoints, maxBps = 1e4) {
  if (basisPoints < 0 || basisPoints > maxBps) {
    throw new ValidationError(`Basis points must be between 0 and ${maxBps}`);
  }
}
function formatEther(wei) {
  return (Number(wei) / 1e18).toFixed(4);
}
function parseEther(ether) {
  return BigInt(Math.floor(parseFloat(ether) * 1e18));
}
function validateEventTiming(startTime, endTime) {
  const now = BigInt(Math.floor(Date.now() / 1e3));
  if (startTime <= now) {
    throw new ValidationError("Event start time must be in the future");
  }
  if (endTime <= startTime) {
    throw new ValidationError("Event end time must be after start time");
  }
}
function validateCapacity(capacity) {
  if (capacity <= 0 || capacity > 1e5) {
    throw new ValidationError("Event capacity must be between 1 and 100,000");
  }
}
function validatePaymentSplits(splits) {
  if (splits.length === 0) {
    throw new ValidationError("At least one payment split is required");
  }
  if (splits.length > 20) {
    throw new ValidationError("Maximum 20 payment splits allowed");
  }
  const totalBps = splits.reduce((sum, split) => sum + split.basisPoints, 0);
  if (totalBps !== 1e4) {
    throw new ValidationError("Payment splits must total exactly 100% (10,000 basis points)");
  }
  for (const split of splits) {
    validateAddress(split.recipient, "payment split recipient");
    validateBasisPoints(split.basisPoints);
  }
}

// src/constants/abi.ts
var ASSEMBLE_ABI = require_abi();

// src/core/events.ts
var EventManager = class {
  constructor(config) {
    this.config = config;
  }
  /**
   * Create a new event
   */
  async createEvent(params) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    validateEventTiming(params.startTime, params.endTime);
    validateCapacity(params.capacity);
    validatePaymentSplits(params.paymentSplits);
    try {
      const eventParams = {
        title: params.title,
        description: params.description,
        imageUri: params.imageUri,
        startTime: params.startTime,
        endTime: params.endTime,
        capacity: params.capacity,
        venueId: params.venueId,
        visibility: params.visibility
      };
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "createEvent",
        args: [eventParams, params.tiers, params.paymentSplits]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to create event", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get event by ID
   */
  async getEvent(eventId) {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "events",
        args: [eventId]
      });
      if (!result || result.organizer === "0x0000000000000000000000000000000000000000") {
        return null;
      }
      const eventData = result;
      return {
        id: eventId,
        title: eventData.title || "",
        description: eventData.description || "",
        imageUri: eventData.imageUri || "",
        startTime: eventData.startTime || 0n,
        endTime: eventData.endTime || 0n,
        capacity: Number(eventData.capacity || 0),
        venueId: eventData.venueId || 0n,
        visibility: eventData.visibility || 0,
        organizer: eventData.organizer,
        isCancelled: eventData.isCancelled || false
      };
    } catch (error) {
      throw new ContractError("Failed to get event", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get multiple events with pagination
   */
  async getEvents(options) {
    try {
      const nextEventId = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "nextEventId",
        args: []
      });
      const offset = options?.offset || 0;
      const limit = options?.limit || 10;
      const events = [];
      const startId = Math.max(1, Number(nextEventId) - offset - limit);
      const endId = Math.max(1, Number(nextEventId) - offset);
      for (let i = startId; i < endId && events.length < limit; i++) {
        try {
          const event = await this.getEvent(BigInt(i));
          if (event && (!options?.organizer || event.organizer === options.organizer)) {
            events.push(event);
          }
        } catch {
          continue;
        }
      }
      return {
        events: events.reverse(),
        // Most recent first
        total: Number(nextEventId) - 1,
        hasMore: offset + limit < Number(nextEventId) - 1
      };
    } catch (error) {
      throw new ContractError("Failed to get events", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Cancel an event
   */
  async cancelEvent(eventId) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "cancelEvent",
        args: [eventId]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to cancel event", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get events organized by a specific address
   */
  async getEventsByOrganizer(organizer) {
    try {
      const response = await this.getEvents({ organizer, limit: 100 });
      return response.events;
    } catch (error) {
      throw new ContractError("Failed to get events by organizer", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Check if an address is the organizer of an event
   */
  async isEventOrganizer(eventId, address) {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "eventOrganizers",
        args: [eventId]
      });
      return result === address;
    } catch (error) {
      throw new ContractError("Failed to check event organizer", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Invite users to a private event
   */
  async inviteToEvent(eventId, invitees) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    if (invitees.length === 0) {
      throw new ValidationError("At least one invitee is required");
    }
    if (invitees.length > 100) {
      throw new ValidationError("Maximum 100 invitees per transaction");
    }
    invitees.forEach((address, index) => {
      validateAddress(address, `invitee ${index}`);
    });
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "inviteToEvent",
        args: [eventId, invitees]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to invite users to event", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Remove invitation from a user
   */
  async removeInvitation(eventId, invitee) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    validateAddress(invitee, "invitee");
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "removeInvitation",
        args: [eventId, invitee]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to remove invitation", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Check if a user is invited to an event
   */
  async isInvited(eventId, user) {
    validateAddress(user, "user");
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "isInvited",
        args: [eventId, user]
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to check invitation status", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Update RSVP status for an event
   */
  async updateRSVP(eventId, status) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    if (!Object.values(RSVPStatus).includes(status)) {
      throw new ValidationError("Invalid RSVP status");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "updateRSVP",
        args: [eventId, status]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to update RSVP", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get user's RSVP status for an event
   */
  async getUserRSVP(eventId, user) {
    validateAddress(user, "user");
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "getUserRSVP",
        args: [eventId, user]
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to get RSVP status", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Check if a user has attended an event
   */
  async hasAttended(eventId, user) {
    validateAddress(user, "user");
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "hasAttended",
        args: [eventId, user]
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to check attendance", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Check if an event is cancelled
   */
  async isEventCancelled(eventId) {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "isEventCancelled",
        args: [eventId]
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to check if event is cancelled", error instanceof Error ? error.message : "Unknown error");
    }
  }
};

// src/core/tickets.ts
var TicketManager = class {
  constructor(config) {
    this.config = config;
  }
  /**
   * Purchase tickets for an event
   */
  async purchaseTickets(params, value) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    if (params.quantity <= 0 || params.quantity > 50) {
      throw new ValidationError("Ticket quantity must be between 1 and 50");
    }
    if (params.referrer) {
      validateAddress(params.referrer, "referrer");
    }
    if (params.platformFeeBps !== void 0) {
      validateBasisPoints(params.platformFeeBps, 500);
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "purchaseTickets",
        args: [
          params.eventId,
          params.tierId,
          params.quantity,
          params.referrer || "0x0000000000000000000000000000000000000000",
          params.platformFeeBps || 0
        ],
        value
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to purchase tickets", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get ticket price for specific quantity
   */
  async calculatePrice(eventId, tierId, quantity) {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "calculatePrice",
        args: [eventId, tierId, quantity]
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to calculate price", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get tickets owned by an address
   */
  async getTickets(owner) {
    try {
      const nextEventId = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "nextEventId",
        args: []
      });
      const tickets = [];
      for (let eventId = 1n; eventId < nextEventId; eventId++) {
        try {
          const event = await this.config.publicClient.readContract({
            address: this.config.contractAddress,
            abi: ASSEMBLE_ABI,
            functionName: "events",
            args: [eventId]
          });
          if (!event) continue;
          for (let tierId = 0; tierId < 10; tierId++) {
            try {
              const balance = await this.getTicketBalance(owner, eventId, tierId);
              if (balance > 0) {
                const tokenId = await this.generateTokenId(eventId, tierId);
                for (let i = 0; i < balance; i++) {
                  tickets.push({
                    eventId,
                    tierId,
                    tokenId: tokenId + BigInt(i),
                    owner,
                    isUsed: false
                    // Would need to check actual usage status
                  });
                }
              }
            } catch {
              break;
            }
          }
        } catch {
          continue;
        }
      }
      return {
        tickets,
        total: tickets.length
      };
    } catch (error) {
      throw new ContractError("Failed to get tickets", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get ticket balance for a specific event and tier
   */
  async getTicketBalance(owner, eventId, tierId) {
    try {
      const tokenId = await this.generateTokenId(eventId, tierId);
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "balanceOf",
        args: [owner, tokenId]
      });
      return Number(result);
    } catch (error) {
      throw new ContractError("Failed to get ticket balance", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Transfer tickets to another address
   */
  async transferTickets(to, eventId, tierId, amount) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    validateAddress(to, "recipient");
    try {
      const tokenId = await this.generateTokenId(eventId, tierId);
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "safeTransferFrom",
        args: [
          this.config.walletClient.account.address,
          to,
          tokenId,
          amount,
          "0x"
        ]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to transfer tickets", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Use/check-in a ticket
   */
  async useTicket(eventId, tierId) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "useTicket",
        args: [eventId, tierId]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to use ticket", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Basic check-in to an event
   */
  async checkIn(eventId) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "checkIn",
        args: [eventId]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to check in", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Check-in with a specific ticket token
   */
  async checkInWithTicket(eventId, ticketTokenId) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "checkInWithTicket",
        args: [eventId, ticketTokenId]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to check in with ticket", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Delegate check-in for another attendee
   */
  async checkInDelegate(eventId, ticketTokenId, attendee) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    validateAddress(attendee, "attendee");
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "checkInDelegate",
        args: [eventId, ticketTokenId, attendee]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to delegate check in", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Validate if a ticket is valid for an event
   */
  async isValidTicketForEvent(tokenId, eventId) {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "isValidTicketForEvent",
        args: [tokenId, eventId]
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to validate ticket", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get refund amounts for a cancelled event
   */
  async getRefundAmounts(eventId, user) {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "getRefundAmounts",
        args: [eventId, user]
      });
      const [ticketRefund, tipRefund] = result;
      return { ticketRefund, tipRefund };
    } catch (error) {
      throw new ContractError("Failed to get refund amounts", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Claim refund for cancelled event
   */
  async claimRefund(eventId) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "claimTicketRefund",
        args: [eventId]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to claim refund", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Claim tip refund for cancelled event
   */
  async claimTipRefund(eventId) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "claimTipRefund",
        args: [eventId]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to claim tip refund", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get total supply of a token
   */
  async totalSupply(tokenId) {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "totalSupply",
        args: [tokenId]
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to get total supply", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Generate token ID for ERC6909 tokens
   * This should match the contract's token ID generation logic
   */
  async generateTokenId(eventId, tierId, serialNumber = 0n) {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "generateTokenId",
        args: [0, eventId, tierId, serialNumber]
        // 0 = EVENT_TICKET type
      });
      return result;
    } catch (error) {
      return eventId << 32n | BigInt(tierId);
    }
  }
};

// src/core/social.ts
var SocialManager = class {
  constructor(config) {
    this.config = config;
  }
  /**
   * Add a friend
   */
  async addFriend(friendAddress) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    validateAddress(friendAddress, "friend address");
    if (friendAddress === this.config.walletClient.account?.address) {
      throw new ValidationError("Cannot add yourself as a friend");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "addFriend",
        args: [friendAddress]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to add friend", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Remove a friend
   */
  async removeFriend(friendAddress) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    validateAddress(friendAddress, "friend address");
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "removeFriend",
        args: [friendAddress]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to remove friend", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get friends list for an address
   */
  async getFriends(userAddress) {
    validateAddress(userAddress, "user address");
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "getFriends",
        args: [userAddress]
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to get friends", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Check if two addresses are friends
   */
  async isFriend(user1, user2) {
    validateAddress(user1, "user1 address");
    validateAddress(user2, "user2 address");
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "isFriend",
        args: [user1, user2]
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to check friendship", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Post a comment on an event
   */
  async postComment(eventId, content, parentId = 0n) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    if (!content.trim()) {
      throw new ValidationError("Comment content cannot be empty");
    }
    if (content.length > 1e3) {
      throw new ValidationError("Comment content cannot exceed 1000 characters");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "postComment",
        args: [eventId, content, parentId]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to post comment", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Delete a comment (moderator only)
   */
  async deleteComment(commentId, eventId) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "deleteComment",
        args: [commentId, eventId]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to delete comment", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Like a comment
   */
  async likeComment(commentId) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "likeComment",
        args: [commentId]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to like comment", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Unlike a comment
   */
  async unlikeComment(commentId) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "unlikeComment",
        args: [commentId]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to unlike comment", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get comments for an event
   */
  async getComments(eventId) {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "getEventComments",
        args: [eventId]
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to get comments", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get all comments for an event (enhanced version)
   */
  async getEventComments(eventId) {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "getEventComments",
        args: [eventId]
      });
      const comments = result;
      const topLevelComments = comments.filter((c) => c.parentId === 0n);
      const replies = comments.filter((c) => c.parentId !== 0n);
      const commentsWithReplies = topLevelComments.map((comment) => ({
        ...comment,
        replies: replies.filter((reply) => reply.parentId === comment.id)
      }));
      return {
        comments: commentsWithReplies,
        total: comments.length
      };
    } catch (error) {
      throw new ContractError("Failed to get event comments", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get a specific comment by ID
   */
  async getComment(commentId) {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "getComment",
        args: [commentId]
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to get comment", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Check if a user has liked a comment
   */
  async hasLikedComment(commentId, userAddress) {
    validateAddress(userAddress, "user address");
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "hasLikedComment",
        args: [commentId, userAddress]
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to check comment like status", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Ban a user from an event
   */
  async banUser(user, eventId) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    validateAddress(user, "user address");
    if (user === this.config.walletClient.account?.address) {
      throw new ValidationError("Cannot ban yourself");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "banUser",
        args: [user, eventId]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to ban user", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Unban a user from an event
   */
  async unbanUser(user, eventId) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    validateAddress(user, "user address");
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "unbanUser",
        args: [user, eventId]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to unban user", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get payment splits for an event
   */
  async getPaymentSplits(eventId) {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "getPaymentSplits",
        args: [eventId]
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to get payment splits", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get pending withdrawals for a user
   */
  async getPendingWithdrawals(user) {
    validateAddress(user, "user address");
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "pendingWithdrawals",
        args: [user]
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to get pending withdrawals", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Tip an event organizer
   */
  async tipEvent(eventId, amount, referrer, platformFeeBps) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    if (amount <= 0n) {
      throw new ValidationError("Tip amount must be greater than 0");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "tipEvent",
        args: [
          eventId,
          referrer || "0x0000000000000000000000000000000000000000",
          platformFeeBps || 0
        ],
        value: amount
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to tip event", error instanceof Error ? error.message : "Unknown error");
    }
  }
};

// src/core/protocol.ts
var ProtocolManager = class {
  constructor(config) {
    this.config = config;
  }
  /**
   * Claim accumulated protocol funds
   */
  async claimFunds() {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "claimFunds",
        args: []
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to claim funds", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Claim organizer credential for an event
   */
  async claimOrganizerCredential(eventId) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "claimOrganizerCredential",
        args: [eventId]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to claim organizer credential", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Set protocol fee (admin only)
   */
  async setProtocolFee(newFeeBps) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    validateBasisPoints(newFeeBps, 1e4);
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "setProtocolFee",
        args: [newFeeBps]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to set protocol fee", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Set fee recipient address (admin only)
   */
  async setFeeTo(newFeeTo) {
    if (!this.config.walletClient) {
      throw new WalletError("Wallet not connected");
    }
    validateAddress(newFeeTo, "fee recipient");
    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "setFeeTo",
        args: [newFeeTo]
      });
      return hash;
    } catch (error) {
      throw new ContractError("Failed to set fee recipient", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get maximum payment splits allowed
   */
  async getMaxPaymentSplits() {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "MAX_PAYMENT_SPLITS",
        args: []
      });
      return Number(result);
    } catch (error) {
      throw new ContractError("Failed to get max payment splits", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get maximum platform fee
   */
  async getMaxPlatformFee() {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "MAX_PLATFORM_FEE",
        args: []
      });
      return Number(result);
    } catch (error) {
      throw new ContractError("Failed to get max platform fee", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get maximum protocol fee
   */
  async getMaxProtocolFee() {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "MAX_PROTOCOL_FEE",
        args: []
      });
      return Number(result);
    } catch (error) {
      throw new ContractError("Failed to get max protocol fee", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get maximum ticket quantity per purchase
   */
  async getMaxTicketQuantity() {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "MAX_TICKET_QUANTITY",
        args: []
      });
      return Number(result);
    } catch (error) {
      throw new ContractError("Failed to get max ticket quantity", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get refund claim deadline
   */
  async getRefundClaimDeadline() {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "REFUND_CLAIM_DEADLINE",
        args: []
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to get refund claim deadline", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get current protocol fee in basis points
   */
  async getProtocolFee() {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "protocolFeeBps",
        args: []
      });
      return Number(result);
    } catch (error) {
      throw new ContractError("Failed to get protocol fee", error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Get current fee recipient address
   */
  async getFeeTo() {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: "feeTo",
        args: []
      });
      return result;
    } catch (error) {
      throw new ContractError("Failed to get fee recipient", error instanceof Error ? error.message : "Unknown error");
    }
  }
};

// src/core/client.ts
var AssembleClient = class _AssembleClient {
  config;
  events;
  tickets;
  social;
  protocol;
  constructor(config) {
    this.config = config;
    this.events = new EventManager(config);
    this.tickets = new TicketManager(config);
    this.social = new SocialManager(config);
    this.protocol = new ProtocolManager(config);
  }
  /**
   * Create a new Assemble client
   */
  static create(options) {
    const config = {
      contractAddress: options.contractAddress,
      publicClient: options.publicClient,
      walletClient: options.walletClient
    };
    return new _AssembleClient(config);
  }
  /**
   * Get the current account address
   */
  get account() {
    return this.config.walletClient?.account?.address;
  }
  /**
   * Check if the client has a wallet connected
   */
  get isConnected() {
    return !!this.config.walletClient && !!this.account;
  }
  /**
   * Get the current chain ID
   */
  async getChainId() {
    try {
      return await this.config.publicClient.getChainId();
    } catch (error) {
      throw new NetworkError("Failed to get chain ID");
    }
  }
  /**
   * Switch to a specific chain
   */
  async switchChain(chainId) {
    if (!this.config.walletClient) {
      throw new WalletError("No wallet connected");
    }
    try {
      await this.config.walletClient.switchChain({ id: chainId });
    } catch (error) {
      throw new NetworkError(`Failed to switch to chain ${chainId}`);
    }
  }
  /**
   * Set a new wallet client
   */
  setWalletClient(walletClient) {
    this.config.walletClient = walletClient;
  }
  /**
   * Remove the wallet client (disconnect)
   */
  disconnect() {
    this.config.walletClient = void 0;
  }
};
var ASSEMBLE_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
var SUPPORTED_CHAINS = {
  mainnet,
  sepolia,
  base,
  baseSepolia
};
var CHAIN_CONTRACT_ADDRESSES = {
  mainnet: ASSEMBLE_CONTRACT_ADDRESS,
  sepolia: ASSEMBLE_CONTRACT_ADDRESS,
  base: ASSEMBLE_CONTRACT_ADDRESS,
  baseSepolia: ASSEMBLE_CONTRACT_ADDRESS
};
function getContractAddress(chain) {
  const chainName = Object.keys(SUPPORTED_CHAINS).find(
    (key) => SUPPORTED_CHAINS[key].id === chain.id
  );
  if (!chainName) {
    throw new Error(`Unsupported chain: ${chain.name} (${chain.id})`);
  }
  return CHAIN_CONTRACT_ADDRESSES[chainName];
}

export { ASSEMBLE_ABI, ASSEMBLE_CONTRACT_ADDRESS, AssembleClient, AssembleError, CHAIN_CONTRACT_ADDRESSES, ContractError, EventManager, EventVisibility, NetworkError, ProtocolManager, RSVPStatus, RefundType, SUPPORTED_CHAINS, SocialManager, TicketManager, ValidationError, WalletError, basisPointsToPercent, formatEther, fromUnixTimestamp, getContractAddress, isAssembleError, isContractError, isNetworkError, isValidAddress, isValidTimestamp, isValidationError, isWalletError, parseEther, percentToBasisPoints, toUnixTimestamp, validateAddress, validateBasisPoints, validateCapacity, validateEventTiming, validatePaymentSplits };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map