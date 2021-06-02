[@bnaya/objectbuffer](../README.md) / ObjectBufferSettings

# Interface: ObjectBufferSettings

## Table of contents

### Properties

- [arrayAdditionalAllocation](objectbuffersettings.md#arrayadditionalallocation)
- [hashMapLoadFactor](objectbuffersettings.md#hashmaploadfactor)
- [hashMapMinInitialCapacity](objectbuffersettings.md#hashmapmininitialcapacity)

## Properties

### arrayAdditionalAllocation

• `Optional` `Readonly` **arrayAdditionalAllocation**: `number`

Allocate additional memory for array pointers,
will prevent the reallocation and copy when array is getting bigger

**`default`** 0

#### Defined in

[internal/interfaces.ts:51](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/interfaces.ts#L51)

___

### hashMapLoadFactor

• `Optional` `Readonly` **hashMapLoadFactor**: `number`

The load factor of the internal hash maps in use

**`default`** 0.75

#### Defined in

[internal/interfaces.ts:40](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/interfaces.ts#L40)

___

### hashMapMinInitialCapacity

• `Optional` `Readonly` **hashMapMinInitialCapacity**: `number`

Minimal initial buckets count of internal hash maps in use

**`default`** 8

#### Defined in

[internal/interfaces.ts:45](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/interfaces.ts#L45)
