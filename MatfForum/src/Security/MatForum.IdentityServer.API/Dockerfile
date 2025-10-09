# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Security/MatForum.IdentityServer.API/MatForum.IdentityServer.API.csproj", "src/Security/MatForum.IdentityServer.API/"]
COPY ["src/Security/MatForum.IdentityServer.Application/MatForum.IdentityServer.Application/MatForum.IdentityServer.Application.csproj", "src/Security/MatForum.IdentityServer.Application/MatForum.IdentityServer.Application/"]
COPY ["src/Security/MatForum.IdentityServer.Domain/MatForum.IdentityServer.Domain.csproj", "src/Security/MatForum.IdentityServer.Domain/"]
COPY ["src/Security/MatForum.IdentityServer.Infrastructure/MatForum.IdentityServer.Infrastructure/MatForum.IdentityServer.Infrastructure.csproj", "src/Security/MatForum.IdentityServer.Infrastructure/MatForum.IdentityServer.Infrastructure/"]
RUN dotnet restore "./src/Security/MatForum.IdentityServer.API/MatForum.IdentityServer.API.csproj"
COPY . .
WORKDIR "/src/src/Security/MatForum.IdentityServer.API"
RUN dotnet build "./MatForum.IdentityServer.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./MatForum.IdentityServer.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MatForum.IdentityServer.API.dll"]