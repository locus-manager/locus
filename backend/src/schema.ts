import { intArg, makeSchema, objectType, stringArg } from '@nexus/schema'
import { nexusPrismaPlugin } from 'nexus-prisma'

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.email()
    t.model.phone()
  },
})

const Place = objectType({
  name: 'Place',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.code()
  },
})

const UsersOnPlaces = objectType({
  name: 'UsersOnPlaces',
  definition(t) {
    t.model.id()
    t.model.placeId()
    t.model.userId()
    t.model.place()
    t.model.user()
    t.model.checkoutDate({ type: 'Date' })
    t.model.checkInDate({ type: 'Date' })
  },
})

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.crud.users({ alias: 'users' })
    t.crud.places({ alias: 'places' })
    t.crud.usersOnPlaces({ alias: 'usersOnPlaces' })

    t.list.field('activeCheckin', {
      type: 'UsersOnPlaces',
      args: {
	email: stringArg({ nullable: false }),
      },
      resolve: async (_, { email }, ctx) => {
	const users = await ctx.prisma.usersOnPlaces.findMany({
	  where: { user: { email } },
	  orderBy: { checkInDate: 'desc' },
	})

	return users.length > 0 ? [ users[0] ] : []
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createUser', {
      type: 'User',
      args: {
        name: stringArg({ nullable: false }),
        email: stringArg({ nullable: false }),
        phone: stringArg({ nullable: false }),
      },
      resolve: (_, { name, email, phone }, ctx) => {
        return ctx.prisma.user.create({ data: { name, email, phone } })
      },
    })

    t.field('createPlace', {
      type: 'User',
      args: {
        name: stringArg({ nullable: false }),
        code: stringArg({ nullable: false }),
      },
      resolve: (_, { name, code }, ctx) => {
        return ctx.prisma.place.create({ data: { name, code } })
      },
    })

    t.field('createUserOnPlace', {
      type: 'User',
      args: {
        name: stringArg({ nullable: false }),
        email: stringArg({ nullable: false }),
        phone: stringArg({ nullable: false }),
        type: stringArg({ nullable: false }),
        code: stringArg({ nullable: false }),
      },
      resolve: async (_, { name, email, phone, type, code }, ctx) => {
        const user = await ctx.prisma.user.upsert({
          where: { email },
          update: { name, phone },
          create: { name, email, phone },
        })

        return await ctx.prisma.usersOnPlaces.create({
          data: {
            user: { connect: { id: user.id } },
            place: { connect: { code: code } },
          },
        })
      },
    })
  },
})

export const schema = makeSchema({
  types: [Query, Mutation, User, Place, UsersOnPlaces],
  plugins: [
    nexusPrismaPlugin({
      experimentalCRUD: true,
    }),
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
  },
})
