import prisma from '../../config/database';
import { calculateDistance, geocodeAddress } from '../../config/googleMaps';

export interface CreateMissionDto {
  title: string;
  description: string;
  address: string;
  price: number;
  urgent?: boolean;
}

export class MissionsService {
  async createMission(clientId: string, data: CreateMissionDto) {
    const coordinates = await geocodeAddress(data.address);

    const mission = await prisma.mission.create({
      data: {
        title: data.title,
        description: data.description,
        address: data.address,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        price: data.price,
        urgent: data.urgent || false,
        clientId,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    return mission;
  }

  async getMissionById(missionId: string) {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        payment: true,
        rating: true,
      },
    });

    if (!mission) {
      throw new Error('Mission not found');
    }

    return mission;
  }

  async getNearbyMissions(providerId: string, maxDistance: number = 10) {
    const provider = await prisma.user.findUnique({
      where: { id: providerId },
    });

    if (!provider || !provider.latitude || !provider.longitude) {
      throw new Error('Provider location not set');
    }

    const allPendingMissions = await prisma.mission.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    const nearbyMissions = [];

    for (const mission of allPendingMissions) {
      const distance = await calculateDistance(
        provider.latitude,
        provider.longitude,
        mission.latitude,
        mission.longitude
      );

      if (distance <= maxDistance) {
        nearbyMissions.push({
          ...mission,
          distance: Math.round(distance * 100) / 100,
        });
      }
    }

    return nearbyMissions.sort((a, b) => a.distance - b.distance);
  }

  async acceptMission(providerId: string, missionId: string) {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      throw new Error('Mission not found');
    }

    if (mission.status !== 'PENDING') {
      throw new Error('Mission is not available');
    }

    const updatedMission = await prisma.mission.update({
      where: { id: missionId },
      data: {
        providerId,
        status: 'ACCEPTED',
        acceptedAt: new Date(),
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    return updatedMission;
  }

  async updateMissionStatus(
    missionId: string,
    status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  ) {
    const updateData: any = { status };

    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const mission = await prisma.mission.update({
      where: { id: missionId },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return mission;
  }

  async getClientMissions(clientId: string) {
    const missions = await prisma.mission.findMany({
      where: { clientId },
      include: {
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        payment: true,
        rating: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return missions;
  }

  async getProviderMissions(providerId: string) {
    const missions = await prisma.mission.findMany({
      where: { providerId },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        payment: true,
        rating: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return missions;
  }

  async sendMessage(missionId: string, senderId: string, receiverId: string, content: string) {
    const message = await prisma.message.create({
      data: {
        missionId,
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return message;
  }

  async getMessages(missionId: string) {
    const messages = await prisma.message.findMany({
      where: { missionId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return messages;
  }
}
