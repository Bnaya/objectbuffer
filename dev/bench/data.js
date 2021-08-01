window.BENCHMARK_DATA = {
  "lastUpdate": 1627832399871,
  "repoUrl": "https://github.com/Bnaya/objectbuffer",
  "entries": {
    "benchmarkjs, node 14": [
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "b2c737b7bf029982da1a286867fdca4c5cff2d4c",
          "message": "Deopts and benchmarks",
          "timestamp": "2020-09-19T12:41:25Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/137/commits/b2c737b7bf029982da1a286867fdca4c5cff2d4c"
        },
        "date": 1600557237895,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 1e6",
            "value": 11097,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "create with 2500 comments. size: 1e6",
            "value": 118,
            "range": "±0.55%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 1e6",
            "value": 111,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "create with all mock data rows. size: 1e6",
            "value": 123,
            "range": "±0.60%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 27377,
            "range": "±0.73%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8289758,
            "range": "±1.01%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1802847,
            "range": "±0.83%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1745070,
            "range": "±1.02%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1738221,
            "range": "±1.24%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16710,
            "range": "±1.16%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1052645,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 990420,
            "range": "±1.03%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 966123,
            "range": "±1.26%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 904018,
            "range": "±0.98%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2638466,
            "range": "±1.17%",
            "unit": "ops/sec",
            "extra": "87 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "d5a9a71b386a525bdd48198087e7968697974f7f",
          "message": "Deopts and benchmarks",
          "timestamp": "2020-09-19T12:41:25Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/137/commits/d5a9a71b386a525bdd48198087e7968697974f7f"
        },
        "date": 1600575340729,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 1e6",
            "value": 10148,
            "range": "±2.02%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "create with 2500 comments. size: 1e6",
            "value": 109,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 1e6",
            "value": 103,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "create with all mock data rows. size: 1e6",
            "value": 112,
            "range": "±0.52%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24114,
            "range": "±0.43%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7392124,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1530745,
            "range": "±0.49%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1506558,
            "range": "±0.48%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1463411,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13662,
            "range": "±0.40%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 818802,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 811073,
            "range": "±0.30%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 813065,
            "range": "±0.29%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 824679,
            "range": "±0.30%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2306860,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "93 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "a684207b157ef4fa6b1213ac2b1ffc7b2e7a55ab",
          "message": "Deopts and benchmarks",
          "timestamp": "2020-09-19T12:41:25Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/137/commits/a684207b157ef4fa6b1213ac2b1ffc7b2e7a55ab"
        },
        "date": 1600576372801,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 1e6",
            "value": 10588,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "create with 2500 comments. size: 1e6",
            "value": 108,
            "range": "±0.74%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 1e6",
            "value": 102,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 1e6",
            "value": 110,
            "range": "±0.76%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 22903,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7403422,
            "range": "±0.66%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1447807,
            "range": "±0.55%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1437091,
            "range": "±0.70%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1447600,
            "range": "±0.69%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14016,
            "range": "±0.78%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 878185,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 854714,
            "range": "±0.68%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 828257,
            "range": "±0.99%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 837059,
            "range": "±0.66%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2206153,
            "range": "±0.47%",
            "unit": "ops/sec",
            "extra": "91 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "ab625c846103dc296f0e3639bff2b021ea2651bd",
          "message": "benchmarks-and-pref-iteration",
          "timestamp": "2020-09-20T04:35:49Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/138/commits/ab625c846103dc296f0e3639bff2b021ea2651bd"
        },
        "date": 1600644075192,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 1e6",
            "value": 10780,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "create with 2500 comments. size: 1e6",
            "value": 103,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 1e6",
            "value": 99.83,
            "range": "±2.27%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "create with all mock data rows. size: 1e6",
            "value": 108,
            "range": "±0.49%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 22463,
            "range": "±1.01%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7478069,
            "range": "±0.45%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1471663,
            "range": "±0.57%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1012836,
            "range": "±0.67%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1010666,
            "range": "±0.51%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13578,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 842352,
            "range": "±0.66%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 835881,
            "range": "±0.53%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 655776,
            "range": "±0.46%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 661698,
            "range": "±0.41%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2171164,
            "range": "±0.72%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 1e6",
            "value": 1.05,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "7 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "ab625c846103dc296f0e3639bff2b021ea2651bd",
          "message": "benchmarks-and-pref-iteration",
          "timestamp": "2020-09-20T04:35:49Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/138/commits/ab625c846103dc296f0e3639bff2b021ea2651bd"
        },
        "date": 1600644432702,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 1e6",
            "value": 10161,
            "range": "±1.25%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "create with 2500 comments. size: 1e6",
            "value": 105,
            "range": "±0.60%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 1e6",
            "value": 97.73,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "create with all mock data rows. size: 1e6",
            "value": 109,
            "range": "±0.46%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 23207,
            "range": "±0.71%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7108665,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1509790,
            "range": "±0.57%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1413548,
            "range": "±0.44%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1437061,
            "range": "±0.60%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14186,
            "range": "±0.43%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 860026,
            "range": "±0.45%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 817811,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 811382,
            "range": "±0.70%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 820134,
            "range": "±0.47%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2501527,
            "range": "±0.33%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 1e6",
            "value": 1.16,
            "range": "±1.17%",
            "unit": "ops/sec",
            "extra": "7 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "409df9ab06b7e01502f3b31d4bf0c1e43cf485cc",
          "message": "General iteration",
          "timestamp": "2020-09-23T18:33:32Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/140/commits/409df9ab06b7e01502f3b31d4bf0c1e43cf485cc"
        },
        "date": 1601052109224,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 1e6",
            "value": 10817,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "create with 2500 comments. size: 1e6",
            "value": 105,
            "range": "±0.32%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 1e6",
            "value": 97.56,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 1e6",
            "value": 106,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 25009,
            "range": "±0.32%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7127168,
            "range": "±0.53%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1598755,
            "range": "±0.41%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1506111,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1508455,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14500,
            "range": "±0.22%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 867417,
            "range": "±0.34%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 831866,
            "range": "±0.30%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 815126,
            "range": "±0.32%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 827773,
            "range": "±0.33%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2334502,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 1e6",
            "value": 1.22,
            "range": "±0.74%",
            "unit": "ops/sec",
            "extra": "8 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "a769c40a3c6229006c9fa4b06e4181b6a7637b0a",
          "message": "Update benchmarks mem size",
          "timestamp": "2020-10-05T04:14:51Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/143/commits/a769c40a3c6229006c9fa4b06e4181b6a7637b0a"
        },
        "date": 1603674355240,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7336,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 101,
            "range": "±0.23%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 93.79,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 105,
            "range": "±0.23%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 23681,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6980344,
            "range": "±0.29%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1507846,
            "range": "±0.48%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1413186,
            "range": "±0.36%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1413574,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13879,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 824800,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 804519,
            "range": "±0.23%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 776079,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 784972,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2370663,
            "range": "±0.22%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 1.19,
            "range": "±1.01%",
            "unit": "ops/sec",
            "extra": "7 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "b49c17092ff2ca2031008e193f2e85c913098b88",
          "message": "Allocator iteration",
          "timestamp": "2020-10-26T01:06:52Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/142/commits/b49c17092ff2ca2031008e193f2e85c913098b88"
        },
        "date": 1603674671308,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7198,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 110,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 107,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 118,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26743,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7953545,
            "range": "±1.02%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1787795,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1677601,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1653294,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 15231,
            "range": "±3.24%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 978238,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 907283,
            "range": "±0.79%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 912394,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 921775,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2774813,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.88,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "7458e4f3060bdd0f132c97083bf3bbe37476be6b",
          "message": "Upgrade deps",
          "timestamp": "2020-10-26T01:21:30Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/144/commits/7458e4f3060bdd0f132c97083bf3bbe37476be6b"
        },
        "date": 1603675858259,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 6362,
            "range": "±4.08%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 102,
            "range": "±0.50%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 96.17,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 106,
            "range": "±0.41%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 23555,
            "range": "±0.61%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7140663,
            "range": "±0.49%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1497886,
            "range": "±0.46%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1423600,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1426342,
            "range": "±0.39%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13820,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 801170,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 785091,
            "range": "±0.39%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 778640,
            "range": "±0.59%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 795571,
            "range": "±0.47%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2469520,
            "range": "±0.69%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.56,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "36 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "4629bf31e6eb0cf70c9fc543dc4337aa29c57f37",
          "message": "Maintenance",
          "timestamp": "2020-11-02T12:39:36Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/145/commits/4629bf31e6eb0cf70c9fc543dc4337aa29c57f37"
        },
        "date": 1606063287973,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 6397,
            "range": "±3.45%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 90.17,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 91.2,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 95.37,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 22077,
            "range": "±1.33%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6967686,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1346119,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1277302,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1294131,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13559,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 816247,
            "range": "±0.29%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 800295,
            "range": "±0.33%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 765195,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 730914,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2106489,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 11.84,
            "range": "±2.79%",
            "unit": "ops/sec",
            "extra": "34 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "c991884e7197b5786059f479db8a1f66a9c2c6c6",
          "message": "Maintenance",
          "timestamp": "2020-11-02T12:39:36Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/145/commits/c991884e7197b5786059f479db8a1f66a9c2c6c6"
        },
        "date": 1606063458409,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7792,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 102,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 97.52,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 106,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 23109,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7531202,
            "range": "±1.25%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1451331,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1462115,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1470076,
            "range": "±1.20%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13192,
            "range": "±1.14%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 855072,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 882375,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 879491,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 891183,
            "range": "±1.16%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2343658,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 10.8,
            "range": "±2.67%",
            "unit": "ops/sec",
            "extra": "31 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "0f944d5233c1a384b50a867369ee1a80caf331fe",
          "message": "Api iteration",
          "timestamp": "2020-11-29T13:38:14Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/146/commits/0f944d5233c1a384b50a867369ee1a80caf331fe"
        },
        "date": 1606933349196,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 6674,
            "range": "±4.21%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 120,
            "range": "±0.31%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 111,
            "range": "±2.82%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 121,
            "range": "±0.58%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26950,
            "range": "±0.06%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8391209,
            "range": "±0.40%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1792382,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1698118,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1698824,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16019,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 977174,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 949770,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 925660,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 936780,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2501352,
            "range": "±0.23%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.86,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "2ffbbd778bc50bb65d4e0c0a3986fa2cb54968a3",
          "message": "Api iteration",
          "timestamp": "2020-12-10T13:07:23Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/146/commits/2ffbbd778bc50bb65d4e0c0a3986fa2cb54968a3"
        },
        "date": 1607647655923,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 9253,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 133,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 124,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 135,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 30188,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 9876088,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 2041795,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1913962,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1915887,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 18530,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1178962,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1130341,
            "range": "±0.93%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1087857,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1105569,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2891762,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.31,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "37 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "05e15fd7c0ae64424e31df4f88529ca9b0aa7285",
          "message": "Api iteration",
          "timestamp": "2020-12-10T13:07:23Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/146/commits/05e15fd7c0ae64424e31df4f88529ca9b0aa7285"
        },
        "date": 1607648308195,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 6683,
            "range": "±3.63%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 92.95,
            "range": "±0.98%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 88.87,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 93.84,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 21729,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7035903,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1440021,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1367424,
            "range": "±0.99%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1350655,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 12419,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 825483,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 790013,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 753911,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 769402,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 1807421,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 9.49,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "28 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "fd6ce0638dfa44a142803c361097d485a674e708",
          "message": "Api iteration",
          "timestamp": "2020-12-10T13:07:23Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/146/commits/fd6ce0638dfa44a142803c361097d485a674e708"
        },
        "date": 1607648361774,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 8504,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 112,
            "range": "±0.56%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 102,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 113,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24530,
            "range": "±0.54%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7508941,
            "range": "±0.52%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1663783,
            "range": "±0.48%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1598947,
            "range": "±0.41%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1592739,
            "range": "±0.50%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14567,
            "range": "±0.48%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 941679,
            "range": "±1.07%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 942592,
            "range": "±0.66%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 899408,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 929518,
            "range": "±0.68%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2636601,
            "range": "±0.66%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.83,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "87062b869383938d2229a48a2198767c849ea385",
          "message": "Api iteration",
          "timestamp": "2020-12-15T23:00:23Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/146/commits/87062b869383938d2229a48a2198767c849ea385"
        },
        "date": 1608073549352,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 6850,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 101,
            "range": "±0.29%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 96.36,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 103,
            "range": "±0.78%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 22323,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7031049,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1389065,
            "range": "±0.36%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1313058,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1316504,
            "range": "±0.36%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13402,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 788327,
            "range": "±0.49%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 780159,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 757122,
            "range": "±0.34%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 766074,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2355739,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.31,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "35 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "87062b869383938d2229a48a2198767c849ea385",
          "message": "Api iteration",
          "timestamp": "2020-12-15T23:00:23Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/146/commits/87062b869383938d2229a48a2198767c849ea385"
        },
        "date": 1608074376948,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 9999,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 123,
            "range": "±0.33%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 115,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 128,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 27664,
            "range": "±0.08%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8274761,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1881236,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1773063,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1772882,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16363,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1016599,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 991294,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 970707,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 989223,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2648703,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 14.03,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "6c14d0e671051aa8cf2a631b56c87c3807155368",
          "message": "Make some lint errors",
          "timestamp": "2020-12-24T09:51:41Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/148/commits/6c14d0e671051aa8cf2a631b56c87c3807155368"
        },
        "date": 1609235933829,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 9683,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 122,
            "range": "±0.53%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 114,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 123,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26855,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8572285,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1851680,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1777095,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1771808,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16436,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1003520,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 978042,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 954925,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 968469,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2644418,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.99,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "0197fe8397c8829dfe5cf8c9cd528e2109128013",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-02-05T20:10:29Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/0197fe8397c8829dfe5cf8c9cd528e2109128013"
        },
        "date": 1614543938541,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7642,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 107,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 100,
            "range": "±2.59%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 112,
            "range": "±1.23%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 23470,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7834736,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1585509,
            "range": "±1.14%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1543342,
            "range": "±1.17%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1600383,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14248,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 946223,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 891547,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 887873,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 883235,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2162469,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 9.77,
            "range": "±2.77%",
            "unit": "ops/sec",
            "extra": "28 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "f0043f2b008fae8f55f9ce92c04e4b388599b44c",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-02-05T20:10:29Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/f0043f2b008fae8f55f9ce92c04e4b388599b44c"
        },
        "date": 1614718660107,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 8101,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 111,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 108,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 118,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 25956,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8614572,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1699373,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1623880,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1661128,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14952,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1042134,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1000004,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 980114,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 980374,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2454194,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 11.72,
            "range": "±2.73%",
            "unit": "ops/sec",
            "extra": "33 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "e43bdcaa5a9685ff903ec6043759d1e1f6888915",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-02-05T20:10:29Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/e43bdcaa5a9685ff903ec6043759d1e1f6888915"
        },
        "date": 1615752345789,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7575,
            "range": "±3.91%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 118,
            "range": "±1.10%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 111,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 121,
            "range": "±1.24%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 27693,
            "range": "±0.79%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8250843,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1863983,
            "range": "±0.71%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1714453,
            "range": "±0.86%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1710875,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16487,
            "range": "±0.79%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1003050,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 970457,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 923803,
            "range": "±1.07%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 939932,
            "range": "±0.82%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2758781,
            "range": "±0.72%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.88,
            "range": "±2.36%",
            "unit": "ops/sec",
            "extra": "38 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "266152d89b5c0900ffbeda706d5a555e618ac29b",
          "message": "Maintenance",
          "timestamp": "2021-02-05T20:10:29Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/150/commits/266152d89b5c0900ffbeda706d5a555e618ac29b"
        },
        "date": 1622637133669,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 8440,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 122,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 114,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 126,
            "range": "±0.59%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 27351,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8705518,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1847982,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1774015,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1770676,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16307,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1005024,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 974879,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 941765,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 970053,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2564304,
            "range": "±0.23%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.9,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "cf5272f4b9fea58e749a99a7764d4372c0c9ed8f",
          "message": "Maintenance",
          "timestamp": "2021-02-05T20:10:29Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/150/commits/cf5272f4b9fea58e749a99a7764d4372c0c9ed8f"
        },
        "date": 1622637573545,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 9908,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 122,
            "range": "±0.38%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 115,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 127,
            "range": "±0.58%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26807,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8812919,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1882156,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1778135,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1775822,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16173,
            "range": "±0.08%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 982118,
            "range": "±0.78%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 963336,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 963609,
            "range": "±0.08%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 975093,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2564821,
            "range": "±0.23%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.96,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "51cec6b99bba91910109291b4074f3099d080f40",
          "message": "Maintenance",
          "timestamp": "2021-02-05T20:10:29Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/150/commits/51cec6b99bba91910109291b4074f3099d080f40"
        },
        "date": 1622647379132,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 9478,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 120,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 112,
            "range": "±3.04%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 128,
            "range": "±0.63%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 27715,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8780035,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1863549,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1774909,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1771113,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16410,
            "range": "±0.23%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 987008,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 980640,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 931598,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 969097,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2536975,
            "range": "±0.22%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.94,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "feff20141dd5c7ae3948c9d9be02d67fa6cbeb3f",
          "message": "Maintenance",
          "timestamp": "2021-02-05T20:10:29Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/150/commits/feff20141dd5c7ae3948c9d9be02d67fa6cbeb3f"
        },
        "date": 1622647490455,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 6590,
            "range": "±3.78%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 96.74,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 88.06,
            "range": "±2.01%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 94.91,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 21728,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7267688,
            "range": "±1.24%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1448225,
            "range": "±1.14%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1392514,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1379377,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13221,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 858932,
            "range": "±1.16%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 845462,
            "range": "±1.02%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 791462,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 794453,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2133525,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 10.16,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "29 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "f5f5b9c3d5bf7d0215e2ba967ec95cb43bfbd383",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/f5f5b9c3d5bf7d0215e2ba967ec95cb43bfbd383"
        },
        "date": 1622706085350,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 9390,
            "range": "±2.19%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 120,
            "range": "±0.07%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 112,
            "range": "±1.02%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 127,
            "range": "±0.56%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26681,
            "range": "±0.22%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8815856,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1828587,
            "range": "±0.33%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1625735,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1607637,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16145,
            "range": "±0.07%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 986706,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 976185,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 897051,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 906324,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2618056,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.93,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "da79a4dd770b28a3a98c068d543c3cf61181b6cf",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/da79a4dd770b28a3a98c068d543c3cf61181b6cf"
        },
        "date": 1622706106716,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7998,
            "range": "±3.98%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 134,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 115,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 137,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 30095,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 9287324,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1969052,
            "range": "±1.14%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1732830,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1873269,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 18099,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1122713,
            "range": "±0.30%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1040521,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 954971,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 942594,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2604501,
            "range": "±0.66%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.89,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "d129a09b12e05121feba26996f28fe65941e3d41",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/d129a09b12e05121feba26996f28fe65941e3d41"
        },
        "date": 1622724064644,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 5813,
            "range": "±3.82%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 92.44,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 89.57,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 93.98,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 19303,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6905773,
            "range": "±0.72%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1320592,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1315877,
            "range": "±0.78%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1282370,
            "range": "±0.84%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 12161,
            "range": "±0.93%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 804632,
            "range": "±0.84%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 771019,
            "range": "±0.63%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 743296,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 769252,
            "range": "±0.66%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2115091,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 9.65,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "28 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "b4027bead76a4d5416cf41f5786bea037d8c8a2e",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/b4027bead76a4d5416cf41f5786bea037d8c8a2e"
        },
        "date": 1622724512318,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 9598,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 119,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 111,
            "range": "±1.75%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 123,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26641,
            "range": "±0.36%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8758074,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1763758,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1731029,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1731014,
            "range": "±0.35%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16306,
            "range": "±0.06%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 990159,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 960352,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 943101,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 954770,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2460124,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.79,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "38 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "704e272b7fc1f7a8344c5def13fc3c673eccee8a",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/704e272b7fc1f7a8344c5def13fc3c673eccee8a"
        },
        "date": 1622725058845,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 8834,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 126,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 114,
            "range": "±2.82%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 127,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 28752,
            "range": "±0.61%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 9335859,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1945671,
            "range": "±0.93%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1867198,
            "range": "±1.10%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1864559,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 17211,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1133485,
            "range": "±1.33%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1031224,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1038388,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1059946,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2657117,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.66,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "36 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "d3aa52902e2ba0bf208e01f998ce416ec8556b03",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/d3aa52902e2ba0bf208e01f998ce416ec8556b03"
        },
        "date": 1622789879339,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7416,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 104,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 96.32,
            "range": "±2.55%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 105,
            "range": "±0.64%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 22569,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7011487,
            "range": "±0.55%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1470021,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1448226,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1445174,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13637,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 838448,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 811070,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 784924,
            "range": "±0.56%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 801806,
            "range": "±0.23%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2255902,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.35,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "35 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "d3aa52902e2ba0bf208e01f998ce416ec8556b03",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/d3aa52902e2ba0bf208e01f998ce416ec8556b03"
        },
        "date": 1622791833135,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 8931,
            "range": "±3.42%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 135,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 127,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 137,
            "range": "±0.58%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 30830,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 10016839,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 2059526,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1988874,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1982740,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 18292,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1117649,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1083197,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1057314,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1079687,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2898550,
            "range": "±0.37%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 15.64,
            "range": "±1.33%",
            "unit": "ops/sec",
            "extra": "43 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "5dd25c09ed2c28a038b6dccbc4b35ba71998e382",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/5dd25c09ed2c28a038b6dccbc4b35ba71998e382"
        },
        "date": 1622824731597,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 5710,
            "range": "±4.72%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 102,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 94.54,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 101,
            "range": "±0.72%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 22764,
            "range": "±0.51%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7116446,
            "range": "±0.41%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1486106,
            "range": "±0.50%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1390935,
            "range": "±0.47%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1392996,
            "range": "±0.40%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13504,
            "range": "±0.43%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 792277,
            "range": "±0.44%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 756978,
            "range": "±0.34%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 761370,
            "range": "±0.38%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 779739,
            "range": "±0.55%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2287538,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.17,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "34 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "5fc66d4dc5e4bbbbe1554ca0f2d3b54791b6d375",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/5fc66d4dc5e4bbbbe1554ca0f2d3b54791b6d375"
        },
        "date": 1622835876604,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7835,
            "range": "±2.21%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 101,
            "range": "±0.76%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 93.69,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 101,
            "range": "±1.14%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 21853,
            "range": "±0.71%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7081636,
            "range": "±0.93%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1409957,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1400514,
            "range": "±0.75%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1418169,
            "range": "±0.67%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13446,
            "range": "±0.78%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 848814,
            "range": "±0.71%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 823615,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 801354,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 816856,
            "range": "±0.82%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2145821,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 10.48,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "30 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "15eb68b4dacd323d8eda8c766fbd1d9af617e6d4",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/15eb68b4dacd323d8eda8c766fbd1d9af617e6d4"
        },
        "date": 1622836399303,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7858,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 99.52,
            "range": "±0.54%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 92.23,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 101,
            "range": "±0.70%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 21376,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6822144,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1496419,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1431637,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1425389,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13476,
            "range": "±0.22%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 818782,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 793519,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 774005,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 780322,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2230174,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 11.74,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "33 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "ccfb0e8f43cb608d8618b55bb71a6682e11ce3a2",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/ccfb0e8f43cb608d8618b55bb71a6682e11ce3a2"
        },
        "date": 1622837307399,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 8311,
            "range": "±2.80%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 110,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 101,
            "range": "±3.41%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 114,
            "range": "±0.97%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24399,
            "range": "±0.64%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7947115,
            "range": "±0.97%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1631623,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1574063,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1529079,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14535,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 963298,
            "range": "±0.59%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 929567,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 908146,
            "range": "±0.75%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 917248,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2358459,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 11.09,
            "range": "±2.16%",
            "unit": "ops/sec",
            "extra": "31 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "80591519f115951c32922ffeafc9aeb51f162263",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/80591519f115951c32922ffeafc9aeb51f162263"
        },
        "date": 1622840634825,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 6889,
            "range": "±3.70%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 99.64,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 99.18,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 99.58,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24831,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7298261,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1584997,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1676114,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1681116,
            "range": "±1.11%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 15697,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 994413,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 933391,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 926796,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 979909,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2661681,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 11.94,
            "range": "±2.61%",
            "unit": "ops/sec",
            "extra": "34 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "ea0857a767ef1b29e8cd153d4601d6ae823fe465",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/ea0857a767ef1b29e8cd153d4601d6ae823fe465"
        },
        "date": 1622840649992,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7150,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 95.3,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 90.77,
            "range": "±2.22%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 99.1,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 21080,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7055367,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1385577,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1320020,
            "range": "±0.85%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1313057,
            "range": "±0.99%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 12638,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 823689,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 783003,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 789251,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 791449,
            "range": "±0.93%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2065282,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 10.05,
            "range": "±2.61%",
            "unit": "ops/sec",
            "extra": "29 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "707695d50209c236e747d1da7cb7f54cb06410fd",
          "message": "Crash",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/152/commits/707695d50209c236e747d1da7cb7f54cb06410fd"
        },
        "date": 1622840838557,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7981,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 101,
            "range": "±0.54%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 95.79,
            "range": "±2.01%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 105,
            "range": "±0.86%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24007,
            "range": "±0.36%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7451743,
            "range": "±0.34%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1565541,
            "range": "±0.41%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1514263,
            "range": "±0.35%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1505365,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13970,
            "range": "±0.39%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 854889,
            "range": "±0.35%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 841263,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 815519,
            "range": "±0.36%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 826043,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2302339,
            "range": "±0.59%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.51,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "35 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "847b9d3eccdbf8058bcb6059c9627661612a1f45",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/847b9d3eccdbf8058bcb6059c9627661612a1f45"
        },
        "date": 1622841064138,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 6017,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 87.81,
            "range": "±0.82%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 83.7,
            "range": "±0.76%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 89.34,
            "range": "±1.03%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 18383,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6541604,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1212983,
            "range": "±0.78%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1133465,
            "range": "±0.58%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1118748,
            "range": "±0.79%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 11351,
            "range": "±0.78%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 690589,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 666921,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 651154,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 662667,
            "range": "±0.63%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 1886104,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 8.84,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "26 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "bd0ad165b1ca38ce02234b3fb9029389e74b4e12",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/bd0ad165b1ca38ce02234b3fb9029389e74b4e12"
        },
        "date": 1622841616573,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 5631,
            "range": "±3.33%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 102,
            "range": "±0.30%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 95.01,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 106,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 23047,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7040453,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1374084,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1403477,
            "range": "±0.35%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1404957,
            "range": "±0.45%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13708,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 800104,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 774278,
            "range": "±0.38%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 756156,
            "range": "±0.32%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 766573,
            "range": "±0.36%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2255161,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.34,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "35 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "d687178c3d48ef85a7ac7c93c3341454daa88281",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/d687178c3d48ef85a7ac7c93c3341454daa88281"
        },
        "date": 1622872197311,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 5702,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 96.49,
            "range": "±0.99%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 91.67,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 92.53,
            "range": "±1.11%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 21493,
            "range": "±0.69%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7003350,
            "range": "±0.65%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1452973,
            "range": "±0.46%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1406624,
            "range": "±0.57%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1411340,
            "range": "±0.68%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13308,
            "range": "±0.52%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 845533,
            "range": "±0.47%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 832208,
            "range": "±0.79%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 805071,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 804729,
            "range": "±0.64%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2050722,
            "range": "±0.38%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 9.27,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "27 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "995a831a4f87dc53fa2c26f50d4716760f62a8fd",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/995a831a4f87dc53fa2c26f50d4716760f62a8fd"
        },
        "date": 1622872976917,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 6897,
            "range": "±3.31%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 109,
            "range": "±0.84%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 99.96,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 109,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24138,
            "range": "±0.56%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7524464,
            "range": "±0.46%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1505256,
            "range": "±0.52%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1533438,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1533137,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14223,
            "range": "±0.55%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 834171,
            "range": "±0.56%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 819519,
            "range": "±0.78%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 850576,
            "range": "±0.91%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 837980,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2336774,
            "range": "±0.52%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.59,
            "range": "±1.73%",
            "unit": "ops/sec",
            "extra": "36 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "d3beb5e9567e1991538196b3a9d0b10b817cd73b",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-08T11:48:39Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/d3beb5e9567e1991538196b3a9d0b10b817cd73b"
        },
        "date": 1623684876467,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 8191,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 110,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 105,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 113,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 23326,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8045310,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1588295,
            "range": "±1.02%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1566788,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1546323,
            "range": "±0.83%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14012,
            "range": "±0.83%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 885411,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 851083,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 859611,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 821661,
            "range": "±0.49%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2200579,
            "range": "±0.52%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 10.76,
            "range": "±2.61%",
            "unit": "ops/sec",
            "extra": "31 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "4d21c0accda9b6f8908c1769ed1106200a6d48c5",
          "message": "Readme update",
          "timestamp": "2021-06-14T15:34:03Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/153/commits/4d21c0accda9b6f8908c1769ed1106200a6d48c5"
        },
        "date": 1623690672071,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 9163,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 120,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 113,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 124,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24732,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8764489,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1635838,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1596004,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1598801,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 15188,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 944072,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 918071,
            "range": "±0.31%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 906371,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 921694,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2367208,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.85,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "58315818dac9590d4718dc18319eb61075437336",
          "message": "Integrate changeset WIP",
          "timestamp": "2021-07-29T14:46:04Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/160/commits/58315818dac9590d4718dc18319eb61075437336"
        },
        "date": 1627585806641,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7307,
            "range": "±3.03%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 105,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 98.23,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 105,
            "range": "±1.14%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 22822,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7397877,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1597432,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1503263,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1550178,
            "range": "±1.03%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13961,
            "range": "±2.25%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 946501,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 926640,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 914280,
            "range": "±1.16%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 903267,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2147946,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 10.97,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "31 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "d111021bb70675af40a62bdf84ad029efc395207",
          "message": "Integrate changeset WIP",
          "timestamp": "2021-07-29T14:46:04Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/160/commits/d111021bb70675af40a62bdf84ad029efc395207"
        },
        "date": 1627585963189,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 9416,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 121,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 114,
            "range": "±1.17%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 125,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 27331,
            "range": "±0.06%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8851974,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1780490,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1689975,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1684943,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16285,
            "range": "±0.06%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 982769,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 959002,
            "range": "±0.08%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 933796,
            "range": "±0.08%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 954753,
            "range": "±0.08%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2643499,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.92,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "e1feaa6308b2df17215623c79b8ff802677d60c5",
          "message": "Integrate changeset WIP",
          "timestamp": "2021-07-30T04:24:51Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/160/commits/e1feaa6308b2df17215623c79b8ff802677d60c5"
        },
        "date": 1627751893135,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 8123,
            "range": "±2.61%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 119,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 111,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 125,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 27284,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8785709,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1821134,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1718936,
            "range": "±0.33%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1716601,
            "range": "±0.31%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16322,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 996329,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 966399,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 937650,
            "range": "±0.56%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 956199,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2614786,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.96,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "a2fe3bb969a607b77dafada0226a0741bd4ab512",
          "message": "Integrate changeset WIP",
          "timestamp": "2021-07-30T04:24:51Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/160/commits/a2fe3bb969a607b77dafada0226a0741bd4ab512"
        },
        "date": 1627782152554,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7218,
            "range": "±2.59%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 108,
            "range": "±0.73%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 99.31,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 109,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24881,
            "range": "±0.47%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7742973,
            "range": "±0.53%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1607557,
            "range": "±0.45%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1537126,
            "range": "±0.34%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1569588,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14479,
            "range": "±0.53%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 870831,
            "range": "±0.54%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 859493,
            "range": "±0.61%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 840918,
            "range": "±0.61%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 846929,
            "range": "±0.55%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2439559,
            "range": "±0.57%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.54,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "35 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "13f0b98834edc30951146ef8270450056cba39fe",
          "message": "Integrate changeset WIP",
          "timestamp": "2021-07-30T04:24:51Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/160/commits/13f0b98834edc30951146ef8270450056cba39fe"
        },
        "date": 1627782171665,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 8706,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 118,
            "range": "±0.97%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 112,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 120,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26199,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8538899,
            "range": "±1.24%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1712110,
            "range": "±0.69%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1687610,
            "range": "±1.20%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1716031,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 15518,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 936726,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 894850,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 870501,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 839559,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2508479,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.52,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "38 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "b595bc70ee8032211d3f8ae195121a269a8fc6e7",
          "message": "Integrate changeset WIP",
          "timestamp": "2021-07-30T04:24:51Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/160/commits/b595bc70ee8032211d3f8ae195121a269a8fc6e7"
        },
        "date": 1627782309907,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7797,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 107,
            "range": "±0.68%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 101,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 106,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 23419,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7751781,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1582130,
            "range": "±0.91%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1468674,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1491491,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13999,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 938914,
            "range": "±0.64%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 892544,
            "range": "±0.75%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 856316,
            "range": "±0.84%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 862244,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2236774,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 10.4,
            "range": "±3.02%",
            "unit": "ops/sec",
            "extra": "30 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "6f5fa3a66296d69191a0e43f83f4697ed023173d",
          "message": "Fix readme basic example",
          "timestamp": "2021-08-01T13:18:33Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/163/commits/6f5fa3a66296d69191a0e43f83f4697ed023173d"
        },
        "date": 1627832399407,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 6756,
            "range": "±3.96%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 101,
            "range": "±1.17%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 91.19,
            "range": "±2.25%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 101,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 22812,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7774371,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1632715,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1520538,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1531014,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14576,
            "range": "±1.23%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 892271,
            "range": "±1.01%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 882176,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 805660,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 806908,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2430642,
            "range": "±1.14%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.73,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "36 samples"
          }
        ]
      }
    ],
    "benchmarkjs, node 12": [
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "b2c737b7bf029982da1a286867fdca4c5cff2d4c",
          "message": "Deopts and benchmarks",
          "timestamp": "2020-09-19T12:41:25Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/137/commits/b2c737b7bf029982da1a286867fdca4c5cff2d4c"
        },
        "date": 1600557240530,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 1e6",
            "value": 2022,
            "range": "±5.18%",
            "unit": "ops/sec",
            "extra": "51 samples"
          },
          {
            "name": "create with 2500 comments. size: 1e6",
            "value": 100,
            "range": "±0.59%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 1e6",
            "value": 95.96,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "create with all mock data rows. size: 1e6",
            "value": 102,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24504,
            "range": "±0.75%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7254685,
            "range": "±0.54%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1571951,
            "range": "±1.04%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1603763,
            "range": "±0.76%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1597374,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14582,
            "range": "±3.84%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 975823,
            "range": "±0.65%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 942014,
            "range": "±0.67%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 908285,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 927117,
            "range": "±0.64%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2707601,
            "range": "±0.35%",
            "unit": "ops/sec",
            "extra": "91 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "d5a9a71b386a525bdd48198087e7968697974f7f",
          "message": "Deopts and benchmarks",
          "timestamp": "2020-09-19T12:41:25Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/137/commits/d5a9a71b386a525bdd48198087e7968697974f7f"
        },
        "date": 1600575339282,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 1e6",
            "value": 2079,
            "range": "±5.72%",
            "unit": "ops/sec",
            "extra": "52 samples"
          },
          {
            "name": "create with 2500 comments. size: 1e6",
            "value": 98.63,
            "range": "±0.72%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 1e6",
            "value": 94.58,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 1e6",
            "value": 106,
            "range": "±0.54%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24766,
            "range": "±0.62%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6648240,
            "range": "±0.76%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1715429,
            "range": "±1.21%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1495147,
            "range": "±0.56%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1499520,
            "range": "±0.76%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14178,
            "range": "±2.67%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 905143,
            "range": "±0.82%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 903832,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 825357,
            "range": "±1.07%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 852830,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2849404,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "93 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "a684207b157ef4fa6b1213ac2b1ffc7b2e7a55ab",
          "message": "Deopts and benchmarks",
          "timestamp": "2020-09-19T12:41:25Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/137/commits/a684207b157ef4fa6b1213ac2b1ffc7b2e7a55ab"
        },
        "date": 1600576371573,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 1e6",
            "value": 2158,
            "range": "±5.81%",
            "unit": "ops/sec",
            "extra": "53 samples"
          },
          {
            "name": "create with 2500 comments. size: 1e6",
            "value": 103,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 1e6",
            "value": 97.88,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 1e6",
            "value": 109,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 25066,
            "range": "±0.91%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7301189,
            "range": "±0.76%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1749371,
            "range": "±0.82%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1565947,
            "range": "±0.65%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1577705,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 15309,
            "range": "±0.99%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 971759,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 930407,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 900394,
            "range": "±0.58%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 916392,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2761281,
            "range": "±1.10%",
            "unit": "ops/sec",
            "extra": "88 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "ab625c846103dc296f0e3639bff2b021ea2651bd",
          "message": "benchmarks-and-pref-iteration",
          "timestamp": "2020-09-20T04:35:49Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/138/commits/ab625c846103dc296f0e3639bff2b021ea2651bd"
        },
        "date": 1600644072624,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 1e6",
            "value": 2011,
            "range": "±5.73%",
            "unit": "ops/sec",
            "extra": "53 samples"
          },
          {
            "name": "create with 2500 comments. size: 1e6",
            "value": 104,
            "range": "±0.45%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 1e6",
            "value": 101,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "create with all mock data rows. size: 1e6",
            "value": 110,
            "range": "±0.45%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 25698,
            "range": "±0.48%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6755452,
            "range": "±0.68%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1731608,
            "range": "±0.29%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1660921,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1614533,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 15099,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 910648,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 895667,
            "range": "±0.35%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 880892,
            "range": "±0.22%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 898432,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2867869,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 1e6",
            "value": 1.22,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "8 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "ab625c846103dc296f0e3639bff2b021ea2651bd",
          "message": "benchmarks-and-pref-iteration",
          "timestamp": "2020-09-20T04:35:49Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/138/commits/ab625c846103dc296f0e3639bff2b021ea2651bd"
        },
        "date": 1600644445913,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 1e6",
            "value": 2057,
            "range": "±4.99%",
            "unit": "ops/sec",
            "extra": "53 samples"
          },
          {
            "name": "create with 2500 comments. size: 1e6",
            "value": 92.91,
            "range": "±12.25%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 1e6",
            "value": 96.58,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "create with all mock data rows. size: 1e6",
            "value": 103,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24910,
            "range": "±1.24%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7179143,
            "range": "±1.23%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1715626,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1612126,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1586096,
            "range": "±1.90%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13779,
            "range": "±1.26%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 931618,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 933114,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 890691,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 911867,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2649373,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 1e6",
            "value": 0.98,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "7 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "409df9ab06b7e01502f3b31d4bf0c1e43cf485cc",
          "message": "General iteration",
          "timestamp": "2020-09-23T18:33:32Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/140/commits/409df9ab06b7e01502f3b31d4bf0c1e43cf485cc"
        },
        "date": 1601052110999,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 1e6",
            "value": 1771,
            "range": "±6.09%",
            "unit": "ops/sec",
            "extra": "42 samples"
          },
          {
            "name": "create with 2500 comments. size: 1e6",
            "value": 98.06,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 1e6",
            "value": 94.07,
            "range": "±1.73%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "create with all mock data rows. size: 1e6",
            "value": 103,
            "range": "±1.25%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24912,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6495162,
            "range": "±0.68%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1587306,
            "range": "±0.99%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1577964,
            "range": "±1.14%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1552720,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14335,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 812868,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 821826,
            "range": "±1.04%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 806400,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 817091,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2773071,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 1e6",
            "value": 1.22,
            "range": "±3.17%",
            "unit": "ops/sec",
            "extra": "8 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "a769c40a3c6229006c9fa4b06e4181b6a7637b0a",
          "message": "Update benchmarks mem size",
          "timestamp": "2020-10-05T04:14:51Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/143/commits/a769c40a3c6229006c9fa4b06e4181b6a7637b0a"
        },
        "date": 1603674386141,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 1343,
            "range": "±8.26%",
            "unit": "ops/sec",
            "extra": "41 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 98.77,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 99.88,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 103,
            "range": "±0.40%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 25438,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6874054,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1674860,
            "range": "±0.69%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1605432,
            "range": "±0.22%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1594017,
            "range": "±2.97%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 15084,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 895900,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 868494,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 862324,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 866932,
            "range": "±1.23%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2896037,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 1.27,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "8 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "b49c17092ff2ca2031008e193f2e85c913098b88",
          "message": "Allocator iteration",
          "timestamp": "2020-10-26T01:06:52Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/142/commits/b49c17092ff2ca2031008e193f2e85c913098b88"
        },
        "date": 1603674708892,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 1292,
            "range": "±7.21%",
            "unit": "ops/sec",
            "extra": "41 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 101,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 102,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 106,
            "range": "±0.59%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26191,
            "range": "±0.60%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6993980,
            "range": "±0.47%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1765164,
            "range": "±0.49%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1668529,
            "range": "±0.50%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1676258,
            "range": "±3.49%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 15473,
            "range": "±0.45%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 925646,
            "range": "±0.41%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 919791,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 893703,
            "range": "±0.49%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 897005,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2972731,
            "range": "±0.49%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.98,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "37 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "7458e4f3060bdd0f132c97083bf3bbe37476be6b",
          "message": "Upgrade deps",
          "timestamp": "2020-10-26T01:21:30Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/144/commits/7458e4f3060bdd0f132c97083bf3bbe37476be6b"
        },
        "date": 1603675858727,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 1272,
            "range": "±8.93%",
            "unit": "ops/sec",
            "extra": "48 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 98.62,
            "range": "±15.98%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 102,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 108,
            "range": "±0.47%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 25401,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6928849,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1677542,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1580780,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1550897,
            "range": "±3.03%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14896,
            "range": "±0.38%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 895878,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 865397,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 852629,
            "range": "±0.23%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 866540,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2835787,
            "range": "±0.59%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.61,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "36 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "4629bf31e6eb0cf70c9fc543dc4337aa29c57f37",
          "message": "Maintenance",
          "timestamp": "2020-11-02T12:39:36Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/145/commits/4629bf31e6eb0cf70c9fc543dc4337aa29c57f37"
        },
        "date": 1606063295108,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 1241,
            "range": "±7.51%",
            "unit": "ops/sec",
            "extra": "39 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 104,
            "range": "±2.75%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 102,
            "range": "±0.62%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 107,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26749,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7082922,
            "range": "±0.48%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1819020,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1756220,
            "range": "±0.60%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1730935,
            "range": "±0.57%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 15835,
            "range": "±0.63%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 948196,
            "range": "±0.53%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 915177,
            "range": "±0.52%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 910634,
            "range": "±0.65%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 915680,
            "range": "±0.52%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2879743,
            "range": "±0.62%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.28,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "37 samples"
          }
        ]
      }
    ],
    "benchmarkjs, node 15": [
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "c991884e7197b5786059f479db8a1f66a9c2c6c6",
          "message": "Maintenance",
          "timestamp": "2020-11-02T12:39:36Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/145/commits/c991884e7197b5786059f479db8a1f66a9c2c6c6"
        },
        "date": 1606063451368,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7565,
            "range": "±2.59%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 112,
            "range": "±1.16%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 103,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 113,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26395,
            "range": "±1.04%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7348705,
            "range": "±0.54%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1496883,
            "range": "±0.83%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1595178,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1489762,
            "range": "±0.57%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 15752,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 909812,
            "range": "±0.73%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 883453,
            "range": "±0.65%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 844700,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 878379,
            "range": "±0.55%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2112897,
            "range": "±0.39%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.77,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "36 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "2ffbbd778bc50bb65d4e0c0a3986fa2cb54968a3",
          "message": "Api iteration",
          "timestamp": "2020-12-10T13:07:23Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/146/commits/2ffbbd778bc50bb65d4e0c0a3986fa2cb54968a3"
        },
        "date": 1607647686104,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 6322,
            "range": "±3.22%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 103,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 98.7,
            "range": "±0.61%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 107,
            "range": "±0.39%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 23447,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6447760,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1509651,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1485843,
            "range": "±0.07%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1487889,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14818,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 876676,
            "range": "±0.29%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 855908,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 851604,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 864217,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2011869,
            "range": "±0.57%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.03,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "34 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "05e15fd7c0ae64424e31df4f88529ca9b0aa7285",
          "message": "Api iteration",
          "timestamp": "2020-12-10T13:07:23Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/146/commits/05e15fd7c0ae64424e31df4f88529ca9b0aa7285"
        },
        "date": 1607648307461,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 6999,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 104,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 96.79,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 103,
            "range": "±1.24%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 22660,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6869392,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1541605,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1489203,
            "range": "±0.97%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1478243,
            "range": "±0.86%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14587,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 990170,
            "range": "±0.86%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 907509,
            "range": "±0.99%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 899437,
            "range": "±1.11%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 918335,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2109412,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 10.45,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "30 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "fd6ce0638dfa44a142803c361097d485a674e708",
          "message": "Api iteration",
          "timestamp": "2020-12-10T13:07:23Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/146/commits/fd6ce0638dfa44a142803c361097d485a674e708"
        },
        "date": 1607648358242,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 6182,
            "range": "±2.90%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 120,
            "range": "±0.46%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 111,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 123,
            "range": "±0.86%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26737,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7930586,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1803644,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1759683,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1757782,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 17228,
            "range": "±0.08%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1042611,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1016038,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1027901,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1038709,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2200670,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.58,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "38 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "87062b869383938d2229a48a2198767c849ea385",
          "message": "Api iteration",
          "timestamp": "2020-12-15T23:00:23Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/146/commits/87062b869383938d2229a48a2198767c849ea385"
        },
        "date": 1608073546088,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 8959,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 119,
            "range": "±0.07%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 115,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 127,
            "range": "±0.61%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26670,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 9088222,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 2074541,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 2026996,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 2018568,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 19823,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1079238,
            "range": "±4.95%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1024853,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1031291,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1046127,
            "range": "±0.32%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 1895741,
            "range": "±0.63%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.76,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "87062b869383938d2229a48a2198767c849ea385",
          "message": "Api iteration",
          "timestamp": "2020-12-15T23:00:23Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/146/commits/87062b869383938d2229a48a2198767c849ea385"
        },
        "date": 1608074375682,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 9820,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 122,
            "range": "±0.38%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 115,
            "range": "±1.11%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 130,
            "range": "±0.61%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26795,
            "range": "±0.07%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7917092,
            "range": "±0.53%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1730844,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1676045,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1669202,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 17419,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1042494,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1014028,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 992867,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 993170,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2286045,
            "range": "±0.65%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.94,
            "range": "±1.17%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "b35d28ea6e83179e6ae291315af15c5a4e8ea9e6",
          "message": "Make some lint errors",
          "timestamp": "2020-12-24T09:51:41Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/148/commits/b35d28ea6e83179e6ae291315af15c5a4e8ea9e6"
        },
        "date": 1609235567044,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 5776,
            "range": "±3.59%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 99.55,
            "range": "±0.72%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 94.2,
            "range": "±2.02%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 104,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 19447,
            "range": "±0.64%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6626717,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1331408,
            "range": "±0.63%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1368444,
            "range": "±0.30%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1373106,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13292,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 800695,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 777473,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 803359,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 804598,
            "range": "±0.23%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 1965922,
            "range": "±0.58%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 11.46,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "33 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "6c14d0e671051aa8cf2a631b56c87c3807155368",
          "message": "Make some lint errors",
          "timestamp": "2020-12-24T09:51:41Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/148/commits/6c14d0e671051aa8cf2a631b56c87c3807155368"
        },
        "date": 1609235933480,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 8811,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 118,
            "range": "±0.45%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 112,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 126,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26526,
            "range": "±0.05%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8487799,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1699329,
            "range": "±0.34%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1733952,
            "range": "±0.30%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1736551,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 17438,
            "range": "±0.07%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 983415,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 947475,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1010034,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1005123,
            "range": "±0.30%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2324194,
            "range": "±0.64%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.82,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "0197fe8397c8829dfe5cf8c9cd528e2109128013",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-02-05T20:10:29Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/0197fe8397c8829dfe5cf8c9cd528e2109128013"
        },
        "date": 1614543941472,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 8166,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 109,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 104,
            "range": "±1.33%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 114,
            "range": "±1.03%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24274,
            "range": "±0.83%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7490802,
            "range": "±1.03%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1613345,
            "range": "±0.85%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1588927,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1599768,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 15904,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1006112,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 949708,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 931696,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 965774,
            "range": "±1.16%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2166386,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 11.09,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "32 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "f0043f2b008fae8f55f9ce92c04e4b388599b44c",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-02-05T20:10:29Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/f0043f2b008fae8f55f9ce92c04e4b388599b44c"
        },
        "date": 1614718674428,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 5400,
            "range": "±6.49%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 102,
            "range": "±0.33%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 94.32,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 107,
            "range": "±0.31%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24155,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6807507,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1479254,
            "range": "±0.33%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1267078,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1270030,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 15224,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 885659,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 866978,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 790370,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 779925,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2224260,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.35,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "35 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "e43bdcaa5a9685ff903ec6043759d1e1f6888915",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-02-05T20:10:29Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/e43bdcaa5a9685ff903ec6043759d1e1f6888915"
        },
        "date": 1615752343307,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7958,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 119,
            "range": "±1.21%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 111,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 119,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24820,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8321018,
            "range": "±1.33%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1629756,
            "range": "±1.01%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1599439,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1584691,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16280,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1002593,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1011141,
            "range": "±0.85%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 983467,
            "range": "±0.82%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 979655,
            "range": "±1.11%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2584965,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 14.53,
            "range": "±2.00%",
            "unit": "ops/sec",
            "extra": "41 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "266152d89b5c0900ffbeda706d5a555e618ac29b",
          "message": "Maintenance",
          "timestamp": "2021-02-05T20:10:29Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/150/commits/266152d89b5c0900ffbeda706d5a555e618ac29b"
        },
        "date": 1622637137267,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 7102,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 119,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 111,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 126,
            "range": "±0.63%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 27714,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8341736,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1790920,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1638032,
            "range": "±0.32%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1645279,
            "range": "±0.39%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 17610,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1068184,
            "range": "±0.31%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1035334,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 969198,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 977188,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2460281,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.94,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      }
    ],
    "benchmarkjs, node 16": [
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "cf5272f4b9fea58e749a99a7764d4372c0c9ed8f",
          "message": "Maintenance",
          "timestamp": "2021-02-05T20:10:29Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/150/commits/cf5272f4b9fea58e749a99a7764d4372c0c9ed8f"
        },
        "date": 1622637575820,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 4737,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 116,
            "range": "±0.75%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 110,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 124,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 27757,
            "range": "±0.05%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7826232,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1759623,
            "range": "±0.63%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1733311,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1734138,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16728,
            "range": "±0.05%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 991051,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 970774,
            "range": "±0.59%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 968658,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 976617,
            "range": "±0.36%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2485587,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.8,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "51cec6b99bba91910109291b4074f3099d080f40",
          "message": "Maintenance",
          "timestamp": "2021-02-05T20:10:29Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/150/commits/51cec6b99bba91910109291b4074f3099d080f40"
        },
        "date": 1622647382882,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 1769,
            "range": "±0.79%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 110,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 106,
            "range": "±4.11%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 115,
            "range": "±0.29%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 29051,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7811641,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1915234,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1810562,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1810135,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 17206,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 972653,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 962870,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 970613,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 981764,
            "range": "±0.29%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2404215,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.58,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "38 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "feff20141dd5c7ae3948c9d9be02d67fa6cbeb3f",
          "message": "Maintenance",
          "timestamp": "2021-02-05T20:10:29Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/150/commits/feff20141dd5c7ae3948c9d9be02d67fa6cbeb3f"
        },
        "date": 1622647491165,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 4790,
            "range": "±6.47%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 95.51,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 89.98,
            "range": "±3.74%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 98.68,
            "range": "±0.51%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 23441,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6309348,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1473845,
            "range": "±0.84%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1420161,
            "range": "±1.23%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1450464,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13590,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 869833,
            "range": "±1.07%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 825477,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 823802,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 848906,
            "range": "±0.73%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2028171,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 9.68,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "28 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "f5f5b9c3d5bf7d0215e2ba967ec95cb43bfbd383",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/f5f5b9c3d5bf7d0215e2ba967ec95cb43bfbd383"
        },
        "date": 1622706103062,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 2789,
            "range": "±4.53%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 87.31,
            "range": "±11.39%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 88.44,
            "range": "±3.88%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 96.59,
            "range": "±0.75%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 21521,
            "range": "±0.75%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6103720,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1418307,
            "range": "±1.02%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1371965,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1391952,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13103,
            "range": "±0.93%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 837581,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 805565,
            "range": "±0.97%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 799617,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 783568,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 1919883,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 9.61,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "28 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "d129a09b12e05121feba26996f28fe65941e3d41",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/d129a09b12e05121feba26996f28fe65941e3d41"
        },
        "date": 1622724057258,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3679,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 118,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 110,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 124,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 27873,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8151884,
            "range": "±0.40%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1903190,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1840770,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1795785,
            "range": "±0.29%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 17056,
            "range": "±0.08%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1035010,
            "range": "±0.33%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 988457,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 980250,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 989067,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2437358,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.7,
            "range": "±1.17%",
            "unit": "ops/sec",
            "extra": "38 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "b4027bead76a4d5416cf41f5786bea037d8c8a2e",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/b4027bead76a4d5416cf41f5786bea037d8c8a2e"
        },
        "date": 1622724518190,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3269,
            "range": "±2.81%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 113,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 107,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 122,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26091,
            "range": "±1.17%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7176017,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1672911,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1642951,
            "range": "±0.60%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1658267,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 17152,
            "range": "±0.93%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1028972,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 978517,
            "range": "±1.25%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 955563,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 946730,
            "range": "±1.01%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2490568,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.15,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "37 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "704e272b7fc1f7a8344c5def13fc3c673eccee8a",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/704e272b7fc1f7a8344c5def13fc3c673eccee8a"
        },
        "date": 1622725060048,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 5004,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 113,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 107,
            "range": "±3.15%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 124,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26347,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7869612,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1720670,
            "range": "±0.41%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1534633,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1484339,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16398,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 959015,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 931911,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 946399,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 961548,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2429016,
            "range": "±0.22%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 14.09,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "d3aa52902e2ba0bf208e01f998ce416ec8556b03",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/149/commits/d3aa52902e2ba0bf208e01f998ce416ec8556b03"
        },
        "date": 1622789887319,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3215,
            "range": "±4.18%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 89.05,
            "range": "±1.14%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 83.86,
            "range": "±3.60%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 95.52,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 22005,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6264715,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1411914,
            "range": "±0.86%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1377964,
            "range": "±0.91%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1376770,
            "range": "±0.68%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13586,
            "range": "±1.01%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 836187,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 788438,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 759261,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 793280,
            "range": "±1.07%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 1931930,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 9.64,
            "range": "±2.26%",
            "unit": "ops/sec",
            "extra": "28 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "d3aa52902e2ba0bf208e01f998ce416ec8556b03",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/d3aa52902e2ba0bf208e01f998ce416ec8556b03"
        },
        "date": 1622791845603,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 5089,
            "range": "±4.26%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 108,
            "range": "±4.75%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 102,
            "range": "±4.40%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 110,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26410,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7726785,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1700656,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1661436,
            "range": "±1.04%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1645777,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 15662,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1013542,
            "range": "±1.04%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 986034,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 962131,
            "range": "±1.11%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 980223,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2284287,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.34,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "35 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "5dd25c09ed2c28a038b6dccbc4b35ba71998e382",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/5dd25c09ed2c28a038b6dccbc4b35ba71998e382"
        },
        "date": 1622824738425,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 4840,
            "range": "±3.55%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 103,
            "range": "±4.34%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 101,
            "range": "±3.40%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 106,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 25086,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7084762,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1636996,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1541597,
            "range": "±1.01%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1701571,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14972,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 923731,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 994716,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 999341,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1014466,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2342869,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 11.8,
            "range": "±2.85%",
            "unit": "ops/sec",
            "extra": "34 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "1f9596bdeb357d5f965718c0a5f329f1c836cec6",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/1f9596bdeb357d5f965718c0a5f329f1c836cec6"
        },
        "date": 1622835260263,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3490,
            "range": "±4.14%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 113,
            "range": "±3.87%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 108,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 123,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 27002,
            "range": "±0.05%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7784065,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1792364,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1771123,
            "range": "±0.07%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1772336,
            "range": "±0.08%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 17064,
            "range": "±0.06%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1002860,
            "range": "±0.32%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 957310,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 954236,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 965883,
            "range": "±0.57%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2469731,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.84,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "5fc66d4dc5e4bbbbe1554ca0f2d3b54791b6d375",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/5fc66d4dc5e4bbbbe1554ca0f2d3b54791b6d375"
        },
        "date": 1622835876852,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3330,
            "range": "±4.72%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 87.16,
            "range": "±2.71%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 82.68,
            "range": "±3.56%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 90.91,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 20994,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 5859298,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1315107,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1238883,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1247819,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 11390,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 750280,
            "range": "±2.61%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 774143,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 741438,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 769095,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 1852362,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 9.25,
            "range": "±3.11%",
            "unit": "ops/sec",
            "extra": "27 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "15eb68b4dacd323d8eda8c766fbd1d9af617e6d4",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/15eb68b4dacd323d8eda8c766fbd1d9af617e6d4"
        },
        "date": 1622836397446,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3680,
            "range": "±2.03%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 96.51,
            "range": "±1.17%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 94.5,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 103,
            "range": "±1.25%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24689,
            "range": "±0.36%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6536672,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1558572,
            "range": "±0.72%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1460195,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1476501,
            "range": "±0.86%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13833,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 853194,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 833114,
            "range": "±1.20%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 870295,
            "range": "±0.46%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 887442,
            "range": "±0.56%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2226293,
            "range": "±0.40%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 11.94,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "34 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "ccfb0e8f43cb608d8618b55bb71a6682e11ce3a2",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/ccfb0e8f43cb608d8618b55bb71a6682e11ce3a2"
        },
        "date": 1622837304482,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3762,
            "range": "±3.29%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 116,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 109,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 123,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 28038,
            "range": "±0.06%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7871423,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1795982,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1691583,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1683748,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16609,
            "range": "±0.07%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 987521,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 952869,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 925696,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 952073,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2345308,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.89,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "80591519f115951c32922ffeafc9aeb51f162263",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/80591519f115951c32922ffeafc9aeb51f162263"
        },
        "date": 1622840631168,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 5497,
            "range": "±3.49%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 114,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 92.16,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 102,
            "range": "±0.75%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 27173,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8038795,
            "range": "±2.23%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1947506,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1874392,
            "range": "±1.26%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1933130,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 17053,
            "range": "±1.16%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1114428,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1070255,
            "range": "±1.17%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1081405,
            "range": "±0.99%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1055947,
            "range": "±1.33%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2540213,
            "range": "±1.03%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.42,
            "range": "±2.19%",
            "unit": "ops/sec",
            "extra": "35 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "ea0857a767ef1b29e8cd153d4601d6ae823fe465",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/ea0857a767ef1b29e8cd153d4601d6ae823fe465"
        },
        "date": 1622840648863,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3968,
            "range": "±3.02%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 119,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 109,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 124,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26592,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7937867,
            "range": "±0.30%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1674092,
            "range": "±0.22%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1628607,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1620343,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 16563,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 975169,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 953736,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 951758,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 963140,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2461371,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.86,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "707695d50209c236e747d1da7cb7f54cb06410fd",
          "message": "Crash",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/152/commits/707695d50209c236e747d1da7cb7f54cb06410fd"
        },
        "date": 1622840836926,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3945,
            "range": "±1.90%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 117,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 111,
            "range": "±2.94%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 123,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 28507,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8038884,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1902145,
            "range": "±0.58%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1850388,
            "range": "±0.37%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1808468,
            "range": "±0.51%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 17480,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1055052,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1019159,
            "range": "±0.15%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1007630,
            "range": "±0.22%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1021690,
            "range": "±0.22%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2404292,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 14.1,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "847b9d3eccdbf8058bcb6059c9627661612a1f45",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/847b9d3eccdbf8058bcb6059c9627661612a1f45"
        },
        "date": 1622841060450,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3846,
            "range": "±3.38%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 101,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 93.24,
            "range": "±3.33%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 106,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 23213,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6614636,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1307404,
            "range": "±0.36%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1260797,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1272768,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13580,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 777489,
            "range": "±0.23%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 784572,
            "range": "±0.69%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 797586,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 813746,
            "range": "±0.23%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2143976,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.36,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "35 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "bd0ad165b1ca38ce02234b3fb9029389e74b4e12",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/bd0ad165b1ca38ce02234b3fb9029389e74b4e12"
        },
        "date": 1622841619833,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3090,
            "range": "±4.11%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 100,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 96.72,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 106,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24417,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6858245,
            "range": "±0.82%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1552355,
            "range": "±2.10%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1413102,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1616184,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 15388,
            "range": "±0.91%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 917413,
            "range": "±0.66%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 908160,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 890043,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 902719,
            "range": "±1.26%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2106015,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 10.19,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "29 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "d687178c3d48ef85a7ac7c93c3341454daa88281",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/d687178c3d48ef85a7ac7c93c3341454daa88281"
        },
        "date": 1622872204495,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3216,
            "range": "±3.52%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 96.1,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 90.04,
            "range": "±3.53%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 103,
            "range": "±0.35%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 22656,
            "range": "±0.35%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6296440,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1427330,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1359901,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1355594,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13587,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 793215,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 764490,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 739544,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 764940,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2076246,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 11.71,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "33 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "995a831a4f87dc53fa2c26f50d4716760f62a8fd",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-02T15:41:18Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/995a831a4f87dc53fa2c26f50d4716760f62a8fd"
        },
        "date": 1622872977610,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 4542,
            "range": "±2.67%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 115,
            "range": "±4.10%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 112,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 125,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 28297,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8151191,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1879404,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1771139,
            "range": "±1.25%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1870512,
            "range": "±1.02%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 17439,
            "range": "±0.99%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1064395,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1022249,
            "range": "±1.25%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 983385,
            "range": "±1.26%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 967330,
            "range": "±1.04%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2516422,
            "range": "±0.99%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 14.45,
            "range": "±2.19%",
            "unit": "ops/sec",
            "extra": "40 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "d3beb5e9567e1991538196b3a9d0b10b817cd73b",
          "message": "Example sandboxes iteration",
          "timestamp": "2021-06-08T11:48:39Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/151/commits/d3beb5e9567e1991538196b3a9d0b10b817cd73b"
        },
        "date": 1623684878631,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3796,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 102,
            "range": "±0.44%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 97.47,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 109,
            "range": "±0.47%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 24456,
            "range": "±0.32%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6439315,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1502196,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1453691,
            "range": "±0.07%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1453021,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 14201,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 830716,
            "range": "±0.34%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 788954,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 783241,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 800506,
            "range": "±0.31%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2168767,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 12.51,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "35 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "4d21c0accda9b6f8908c1769ed1106200a6d48c5",
          "message": "Readme update",
          "timestamp": "2021-06-14T15:34:03Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/153/commits/4d21c0accda9b6f8908c1769ed1106200a6d48c5"
        },
        "date": 1623690684564,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 2428,
            "range": "±3.17%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 93.54,
            "range": "±5.46%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 90.96,
            "range": "±3.53%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 100,
            "range": "±1.26%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 23657,
            "range": "±0.75%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 6411370,
            "range": "±0.70%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 1471254,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1468033,
            "range": "±1.03%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1464997,
            "range": "±1.26%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 13907,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 894784,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 865359,
            "range": "±0.75%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 833963,
            "range": "±1.16%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 874834,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 1953001,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 9.95,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "29 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "58315818dac9590d4718dc18319eb61075437336",
          "message": "Integrate changeset WIP",
          "timestamp": "2021-07-29T14:46:04Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/160/commits/58315818dac9590d4718dc18319eb61075437336"
        },
        "date": 1627585785074,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 4009,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 119,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 113,
            "range": "±3.51%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 126,
            "range": "±0.23%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 31196,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8131649,
            "range": "±0.35%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 2159548,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 2089297,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 2087248,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 18358,
            "range": "±0.07%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1136286,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1109762,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1093864,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1107494,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2464535,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.86,
            "range": "±1.23%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "d111021bb70675af40a62bdf84ad029efc395207",
          "message": "Integrate changeset WIP",
          "timestamp": "2021-07-29T14:46:04Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/160/commits/d111021bb70675af40a62bdf84ad029efc395207"
        },
        "date": 1627585966368,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3127,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 116,
            "range": "±3.94%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 111,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 124,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 32539,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8204765,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 2155418,
            "range": "±0.06%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 2073903,
            "range": "±0.08%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 2067433,
            "range": "±0.08%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 18592,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1127084,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1090482,
            "range": "±0.18%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1078586,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1097178,
            "range": "±0.10%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2483306,
            "range": "±0.31%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.94,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "13f0b98834edc30951146ef8270450056cba39fe",
          "message": "Integrate changeset WIP",
          "timestamp": "2021-07-30T04:24:51Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/160/commits/13f0b98834edc30951146ef8270450056cba39fe"
        },
        "date": 1627782172990,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3040,
            "range": "±4.52%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 91.8,
            "range": "±9.32%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 110,
            "range": "±3.38%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 91.14,
            "range": "±8.12%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 32014,
            "range": "±0.24%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8090176,
            "range": "±0.48%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 2119892,
            "range": "±0.06%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 2022423,
            "range": "±0.11%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1997436,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "99 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 19686,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1167335,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1164565,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1148182,
            "range": "±0.09%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1141696,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2585237,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.72,
            "range": "±1.24%",
            "unit": "ops/sec",
            "extra": "38 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "b595bc70ee8032211d3f8ae195121a269a8fc6e7",
          "message": "Integrate changeset WIP",
          "timestamp": "2021-07-30T04:24:51Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/160/commits/b595bc70ee8032211d3f8ae195121a269a8fc6e7"
        },
        "date": 1627782309258,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3014,
            "range": "±6.27%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 84.64,
            "range": "±9.54%",
            "unit": "ops/sec",
            "extra": "57 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 105,
            "range": "±3.38%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 87.37,
            "range": "±8.33%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 26959,
            "range": "±14.82%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 7033809,
            "range": "±0.84%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 2026291,
            "range": "±1.03%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1914508,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 1881258,
            "range": "±3.03%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 18048,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1106586,
            "range": "±1.20%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1071055,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1090825,
            "range": "±3.26%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1118316,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2566594,
            "range": "±0.91%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.64,
            "range": "±2.59%",
            "unit": "ops/sec",
            "extra": "38 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "committer": {
            "name": "Bnaya",
            "username": "Bnaya"
          },
          "id": "6f5fa3a66296d69191a0e43f83f4697ed023173d",
          "message": "Fix readme basic example",
          "timestamp": "2021-08-01T13:18:33Z",
          "url": "https://github.com/Bnaya/objectbuffer/pull/163/commits/6f5fa3a66296d69191a0e43f83f4697ed023173d"
        },
        "date": 1627832393251,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "create empty, size: 2e6",
            "value": 3846,
            "range": "±5.00%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "create with 2500 comments. size: 2e6",
            "value": 89.12,
            "range": "±9.04%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "save 2500 comments into pre-created OB, size: 2e6",
            "value": 112,
            "range": "±3.12%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "create with all mock data rows. size: 2e6",
            "value": 92.47,
            "range": "±8.03%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "A-Z object keys",
            "value": 32878,
            "range": "±0.06%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - non-existing",
            "value": 8043430,
            "range": "±0.19%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "A-Z object prop Lookup in operator - existing",
            "value": 2163070,
            "range": "±0.17%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "A-Z object prop access T",
            "value": 1995152,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "A-Z object prop access Z",
            "value": 2023272,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object keys",
            "value": 19969,
            "range": "±0.29%",
            "unit": "ops/sec",
            "extra": "97 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing",
            "value": 1157196,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing",
            "value": 1194725,
            "range": "±0.13%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1141738,
            "range": "±0.08%",
            "unit": "ops/sec",
            "extra": "96 samples"
          },
          {
            "name": "OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "value": 1136581,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "Array access. length: 1000",
            "value": 2584199,
            "range": "±0.12%",
            "unit": "ops/sec",
            "extra": "95 samples"
          },
          {
            "name": "object memory free. K1000RowsMockData, pre-created OB, size: 2e6",
            "value": 13.94,
            "range": "±1.17%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      }
    ]
  }
}