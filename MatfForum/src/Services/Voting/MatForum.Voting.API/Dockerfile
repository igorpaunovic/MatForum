FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Services/Voting/MatForum.Voting.API/MatForum.Voting.API.csproj", "src/Services/Voting/MatForum.Voting.API/"]
COPY ["src/Services/Voting/MatForum.Voting.Application/MatForum.Voting.Application.csproj", "src/Services/Voting/MatForum.Voting.Application/"]
COPY ["src/Services/Voting/MatForum.Voting.Domain/MatForum.Voting.Domain.csproj", "src/Services/Voting/MatForum.Voting.Domain/"]
COPY ["src/Shared/MatForum.Shared.Domain/MatForum.Shared.Domain.csproj", "src/Shared/MatForum.Shared.Domain/"]
COPY ["src/Services/Voting/MatForum.Voting.Infrastructure/MatForum.Voting.Infrastructure.csproj", "src/Services/Voting/MatForum.Voting.Infrastructure/"]
RUN dotnet restore "src/Services/Voting/MatForum.Voting.API/MatForum.Voting.API.csproj"
COPY . .
WORKDIR "/src/src/Services/Voting/MatForum.Voting.API"
RUN dotnet build "./MatForum.Voting.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./MatForum.Voting.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MatForum.Voting.API.dll"]
