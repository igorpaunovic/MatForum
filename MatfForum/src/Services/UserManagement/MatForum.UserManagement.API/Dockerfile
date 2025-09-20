FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Services/UserManagement/MatForum.UserManagement.API/MatForum.UserManagement.API.csproj", "src/Services/UserManagement/MatForum.UserManagement.API/"]
COPY ["src/Services/UserManagement/MatForum.UserManagement.Domain/MatForum.UserManagement.Domain.csproj", "src/Services/UserManagement/MatForum.UserManagement.Domain/"]
COPY ["src/Shared/MatForum.Shared.Domain/MatForum.Shared.Domain.csproj", "src/Shared/MatForum.Shared.Domain/"]
COPY ["src/Services/UserManagement/MatForum.UserManagement.Application/MatForum.UserManagement.Application.csproj", "src/Services/UserManagement/MatForum.UserManagement.Application/"]
COPY ["src/Services/UserManagement/MatForum.UserManagement.Infrastructure/MatForum.UserManagement.Infrastructure.csproj", "src/Services/UserManagement/MatForum.UserManagement.Infrastructure/"]
COPY ["src/Shared/MatForum.Shared.Infrastructure/MatForum.Shared.Infrastructure.csproj", "src/Shared/MatForum.Shared.Infrastructure/"]
COPY ["src/Shared/MatForum.Shared.Contracts/MatForum.Shared.Contracts.csproj", "src/Shared/MatForum.Shared.Contracts/"]
RUN dotnet restore "src/Services/UserManagement/MatForum.UserManagement.API/MatForum.UserManagement.API.csproj"
COPY . .
WORKDIR "/src/src/Services/UserManagement/MatForum.UserManagement.API"
RUN dotnet build "./MatForum.UserManagement.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./MatForum.UserManagement.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MatForum.UserManagement.API.dll"]
