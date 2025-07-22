# Use the official .NET 8 runtime as base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution file
COPY ["MatForum.sln", "."]

# Copy project files
COPY ["src/Services/User/MatForum.User.API/MatForum.User.API.csproj", "src/Services/User/MatForum.User.API/"]
COPY ["src/Services/User/MatForum.User.Application/MatForum.User.Application.csproj", "src/Services/User/MatForum.User.Application/"]
COPY ["src/Services/User/MatForum.User.Domain/MatForum.User.Domain.csproj", "src/Services/User/MatForum.User.Domain/"]
COPY ["src/Services/User/MatForum.User.Infrastructure/MatForum.User.Infrastructure.csproj", "src/Services/User/MatForum.User.Infrastructure/"]
COPY ["src/Shared/MatForum.Shared.Contracts/MatForum.Shared.Contracts.csproj", "src/Shared/MatForum.Shared.Contracts/"]
COPY ["src/Shared/MatForum.Shared.Domain/MatForum.Shared.Domain.csproj", "src/Shared/MatForum.Shared.Domain/"]
COPY ["src/Shared/MatForum.Shared.Infrastructure/MatForum.Shared.Infrastructure.csproj", "src/Shared/MatForum.Shared.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "src/Services/User/MatForum.User.API/MatForum.User.API.csproj"

# Copy all source code
COPY . .

# Build the application
WORKDIR "/src/src/Services/User/MatForum.User.API"
RUN dotnet build "MatForum.User.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "MatForum.User.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage - runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MatForum.User.API.dll"]