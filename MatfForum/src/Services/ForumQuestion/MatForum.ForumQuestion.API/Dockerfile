FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Services/ForumQuestion/MatForum.ForumQuestion.API/MatForum.ForumQuestion.API.csproj", "src/Services/ForumQuestion/MatForum.ForumQuestion.API/"]
COPY ["src/Services/ForumQuestion/MatForum.ForumQuestion.Application/MatForum.ForumQuestion.Application.csproj", "src/Services/ForumQuestion/MatForum.ForumQuestion.Application/"]
COPY ["src/Services/ForumQuestion/MatForum.ForumQuestion.Domain/MatForum.ForumQuestion.Domain.csproj", "src/Services/ForumQuestion/MatForum.ForumQuestion.Domain/"]
COPY ["src/Shared/MatForum.Shared.Domain/MatForum.Shared.Domain.csproj", "src/Shared/MatForum.Shared.Domain/"]
COPY ["src/Services/ForumQuestion/MatForum.ForumQuestion.Infrastructure/MatForum.ForumQuestion.Infrastructure.csproj", "src/Services/ForumQuestion/MatForum.ForumQuestion.Infrastructure/"]
RUN dotnet restore "src/Services/ForumQuestion/MatForum.ForumQuestion.API/MatForum.ForumQuestion.API.csproj"
COPY . .
WORKDIR "/src/src/Services/ForumQuestion/MatForum.ForumQuestion.API"
RUN dotnet build "./MatForum.ForumQuestion.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./MatForum.ForumQuestion.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MatForum.ForumQuestion.API.dll"]
