import {
  asNexusMethod,
  intArg,
  makeSchema,
  objectType,
  stringArg,
} from '@nexus/schema'
import { nexusPrismaPlugin } from 'nexus-prisma'
import { GraphQLDateTime } from 'graphql-iso-date'

export const GQLDateTime = asNexusMethod(GraphQLDateTime, 'datetime')

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
    t.model.floor()
  },
})

const Session = objectType({
  name: 'Session',
  definition(t) {
    t.model.id()
    t.model.placeId()
    t.model.userId()
    t.model.place()
    t.model.user()
    t.datetime('checkinDate')
    t.datetime('checkoutDate')
  },
})

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.crud.users({ alias: 'users' })
    t.crud.places({ alias: 'places' })
    t.crud.sessions({ alias: 'sessions' })

    t.list.field('activeCheckin', {
      type: 'Session',
      args: {
        email: stringArg({ nullable: false }),
      },
      resolve: async (_, { email }, ctx) => {
        const users = await ctx.prisma.session.findMany({
          where: { user: { email }, checkoutDate: null },
          orderBy: { checkinDate: 'desc' },
        })

        return users.length > 0 ? [users[0]] : []
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
      type: 'Place',
      args: {
        name: stringArg({ nullable: false }),
        floor: stringArg({ nullable: false }),
      },
      resolve: (_, { name, floor }, ctx): Promise<any> => {
        return ctx.prisma.place.create({ data: { name, floor } })
      },
    })

    t.field('createSession', {
      type: 'Session',
      args: {
        name: stringArg({ nullable: false }),
        email: stringArg({ nullable: false }),
        phone: stringArg({ nullable: false }),
        type: stringArg({ nullable: false }),
        code: stringArg({ nullable: false }),
        checkin: stringArg({ nullable: true }),
      },
      resolve: async (
        _,
        { name, email, phone, type, code, checkin },
        ctx,
      ): Promise<any> => {
        const user = await ctx.prisma.user.upsert({
          where: { email },
          update: { name, phone },
          create: { name, email, phone },
        })

        const currentDate = new Date()

        switch (type) {
          case 'checkin':
            // Must close the previous session setting current time
            await ctx.prisma.session.updateMany({
              where: { user: { email }, checkoutDate: null },
              data: { checkoutDate: currentDate.toISOString() },
            })

            return await ctx.prisma.session.create({
              data: {
                user: { connect: { id: user.id } },
                place: { connect: { id: code } },
                checkinDate: currentDate.toISOString(),
              },
            })
          case 'checkout':
            const datesToBeUpdated: {
              checkinDate?: string
              checkoutDate?: string
            } = {}

            datesToBeUpdated.checkoutDate = currentDate.toISOString()
            if (checkin) {
              const [hour, minutes] = checkin.split(':')
              currentDate.setHours(Number(hour))
              currentDate.setMinutes(Number(minutes))
              datesToBeUpdated.checkinDate = currentDate.toISOString()
            }

            const openSessions = await ctx.prisma.session.findMany({
              where: { user: { email }, checkoutDate: null },
              orderBy: { checkinDate: 'desc' },
            })

            const currentSession =
              openSessions.length > 0 ? openSessions[0] : <any>{ id: undefined }

            return await ctx.prisma.session.upsert({
              where: { id: currentSession.id },
              create: {
                user: { connect: { id: user.id } },
                place: { connect: { id: code } },
                ...datesToBeUpdated,
              },
              update: {
                ...datesToBeUpdated,
              },
            })
        }
      },
    })
  },
})

export const schema = makeSchema({
  types: [Query, Mutation, GQLDateTime, User, Place, Session],
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
